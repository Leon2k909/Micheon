/**
 * French for the Life in the UK practice questions.
 *
 * The lesson cards are answered by LIFE_IN_THE_UK_FR. These are the other
 * body of text in the same pack: the practice bank, reached through
 * UkPracticeView and UkTestView — both named "Uk" but shared by all seven
 * packs, and through ukSessionQuizzes, which folds this bank into the stepped
 * lesson. Until this table a lesson read in French and then asked its
 * questions in English.
 *
 * Keyed on the ENGLISH source text exactly as it appears in ukQuestionBank.ts
 * — question, every option and explanation. Each key was extracted from the
 * built module and paired back, never retyped: one wrong character, a
 * straight apostrophe where the source has a typographic one, and the lookup
 * misses in silence. The question renders in English, the tap works, and
 * nothing anywhere reports it.
 *
 * WHAT STAYS ENGLISH follows LIFE_IN_THE_UK_FR exactly, because a reader
 * meets the lesson and its questions one after the other and a word glossed
 * two ways between them teaches nothing. The exam is sat in English and asks
 * for those exact words, so translating them would teach the wrong answer:
 *
 *   - the laws, offices and institutions — Magna Carta, the Equality Act
 *     2010, the Human Rights Act 1998, the House of Commons, the House of
 *     Lords, the NHS, National Insurance, the Union Flag, the Good Friday
 *     Agreement, the Senedd, Holyrood;
 *   - place names, so that someone reading a road sign in Britain has the
 *     word they will actually see. The French exonym leads only where French
 *     would never say anything else — Londres, la Tamise, l'Écosse, le pays
 *     de Galles;
 *   - what French does have a name for gets it: l'État de droit, les critères
 *     protégés, la guerre des Deux-Roses, la peste noire, and the wording is
 *     the card's wording, not a second invention.
 *
 * The keep list in check-fr-bank-translation was measured against this table
 * before it was written down, not guessed: a term the gate watches has to be
 * one that is actually kept in three keys or more, or listing it is only
 * decoration.
 *
 * Two hundred and fifty-two of the bank's strings are not here and that is
 * correct: they are years, bare numbers and short answers that LIFE_IN_THE_UK_FR
 * already answers. Every French table is spread into one object, so a key
 * present in two of them would lose one silently — the later spread would
 * decide both. check-fr-bank-translation measures coverage through
 * translateCourseText, the lookup a reader's tap actually goes through, so
 * those count as answered and are not duplicated here.
 */
export const UK_QUESTION_BANK_FR: Record<string, string> = {
  "What does the rule of law mean?": "Que signifie l'État de droit ?",
  "The police may act outside the law when necessary":
    "La police peut agir hors la loi quand cela est nécessaire",
  "Everyone is subject to the law, including the government":
    "Tout le monde est soumis à la loi, y compris le gouvernement",
  "Only judges are bound by the law": "Seuls les juges sont tenus par la loi",
  "Laws apply only to citizens": "Les lois ne s'appliquent qu'aux citoyens",
  "Nobody is above the law — not ministers, not the police, not the government itself. That is what makes it the rule of LAW rather than the rule of whoever is in charge.":
    "Personne n'est au-dessus de la loi — ni les ministres, ni la police, ni le gouvernement lui-même. C'est ce qui fait régner la LOI et non celui qui se trouve aux commandes.",
  "What does tolerance mean as a British value?":
    "Que signifie la tolérance en tant que valeur britannique ?",
  "Agreeing with every religion": "Être d'accord avec toutes les religions",
  "Respect for people of different faiths and beliefs, and of none":
    "Le respect des personnes d'autres confessions et convictions, et de celles qui n'en ont aucune",
  "Keeping your opinions to yourself": "Garder ses opinions pour soi",
  "Following the established church": "Suivre l'Église établie",
  "Tolerance is respect, not agreement — and it explicitly covers people with no religious belief as well as believers.":
    "La tolérance est le respect, non l'accord — et elle couvre expressément les personnes sans croyance religieuse aussi bien que les croyants.",
  "Membership of a church": "L'appartenance à une Église",
  "The rule of law means everyone is subject to the law, including those who govern. The others are not British values at all.":
    "L'État de droit veut que chacun soit soumis à la loi, y compris ceux qui gouvernent. Les autres ne sont pas du tout des valeurs britanniques.",
  "How many protected characteristics does the Equality Act 2010 list?":
    "Combien de critères protégés l'Equality Act 2010 énonce-t-il ?",
  "Five": "Cinq",
  "Seven": "Sept",
  "Nine": "Neuf",
  "Twelve": "Douze",
  "Nine: age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation.":
    "Neuf : l'âge, le handicap, le changement de genre, le mariage et le partenariat civil, la grossesse et la maternité, la race, la religion ou les convictions, le sexe et l'orientation sexuelle.",
  "Which of these is NOT protected under the Equality Act 2010?":
    "Lequel de ces critères n'est PAS protégé par l'Equality Act 2010 ?",
  "Pregnancy and maternity": "La grossesse et la maternité",
  "Political opinion is not a protected characteristic in Great Britain. The other three are among the nine that are.":
    "L'opinion politique n'est pas un critère protégé en Grande-Bretagne. Les trois autres font partie des neuf qui le sont.",
  "Is freedom of speech in the UK unlimited?":
    "La liberté d'expression est-elle sans limite au Royaume-Uni ?",
  "Yes, nothing said may be prosecuted": "Oui, aucune parole ne peut être poursuivie",
  "No — inciting violence or racial hatred is a criminal offence":
    "Non — inciter à la violence ou à la haine raciale est un délit",
  "Yes, but only in private": "Oui, mais en privé seulement",
  "No — all criticism of the government is banned":
    "Non — toute critique du gouvernement est interdite",
  "Freedom of speech is a real right with a real boundary. Speech that incites violence or racial hatred is a crime.":
    "La liberté d'expression est un droit réel avec une limite réelle. Les propos qui incitent à la violence ou à la haine raciale sont un délit.",
  "Which law sets out the protected characteristics?": "Quelle loi énonce les critères protégés ?",
  "The Human Rights Act 1998": "Le Human Rights Act 1998",
  "The Equality Act 2010": "L'Equality Act 2010",
  "The Bill of Rights 1689": "Le Bill of Rights 1689",
  "The Equality Act 2010. The Human Rights Act 1998 is the separate law that brought the European Convention on Human Rights into UK law.":
    "L'Equality Act 2010. Le Human Rights Act 1998 est l'autre loi, celle qui a intégré la Convention européenne des droits de l'homme au droit britannique.",
  "A landlord refuses to rent to someone because of their religion. What is this?":
    "Un propriétaire refuse de louer à quelqu'un en raison de sa religion. Qu'est-ce que c'est ?",
  "Lawful, as it is private property": "C'est licite, puisqu'il s'agit d'un bien privé",
  "Unlawful discrimination under the Equality Act 2010":
    "Une discrimination illicite au regard de l'Equality Act 2010",
  "Lawful if no contract was signed": "C'est licite si aucun contrat n'a été signé",
  "A civil matter with no legal protection": "Une affaire civile sans protection légale",
  "Religion or belief is one of the nine protected characteristics, and housing is covered. Owning the property does not create an exemption.":
    "La religion ou les convictions font partie des neuf critères protégés, et le logement est couvert. Être propriétaire du bien ne crée aucune dispense.",
  "Which of these is a responsibility rather than a right?":
    "Lequel de ces éléments est un devoir et non un droit ?",
  "Serving on a jury when summoned": "Siéger comme juré lorsqu'on est convoqué",
  "Freedom from discrimination": "Être à l'abri de la discrimination",
  "Jury service is a duty you must perform when called. The other three are rights you hold.":
    "Le jury service est un devoir auquel il faut se plier quand on est appelé. Les trois autres sont des droits que l'on détient.",
  "What does democracy mean in the UK?": "Que signifie la démocratie au Royaume-Uni ?",
  "The monarch decides policy": "Le monarque décide de la politique",
  "Government by the people, through representatives they elect and can vote out":
    "Le gouvernement par le peuple, au moyen de représentants qu'il élit et qu'il peut renvoyer",
  "Every law is put to a public vote": "Chaque loi est soumise à un vote public",
  "The courts choose the government": "Les tribunaux choisissent le gouvernement",
  "Representative democracy: you elect MPs, and you can remove them at the next election. Referendums happen but are the exception, not the system.":
    "Une démocratie représentative : on élit des MPs, et on peut les écarter à l'élection suivante. Il y a des référendums, mais ils sont l'exception, non le système.",
  "Which of these is a right rather than a responsibility?":
    "Lequel de ces éléments est un droit et non un devoir ?",
  "Paying income tax": "Payer l'impôt sur le revenu",
  "Freedom from unfair discrimination": "Être à l'abri de la discrimination injuste",
  "Obeying the law": "Respecter la loi",
  "Freedom from discrimination is a right you hold. Tax, jury service and obeying the law are duties owed in return.":
    "Être à l'abri de la discrimination est un droit que l'on détient. L'impôt, le jury service et le respect de la loi sont les devoirs qui viennent en retour.",
  "Freedom to live as you choose within the law":
    "La liberté de vivre comme on l'entend dans le cadre de la loi",
  "Which four nations make up the United Kingdom?":
    "Quelles quatre nations composent le Royaume-Uni ?",
  "England, Scotland, Wales and Ireland": "L'Angleterre, l'Écosse, le pays de Galles et l'Irlande",
  "England, Scotland, Wales and Northern Ireland":
    "L'Angleterre, l'Écosse, le pays de Galles et l'Irlande du Nord",
  "England, Scotland, Wales and the Isle of Man":
    "L'Angleterre, l'Écosse, le pays de Galles et l'Isle of Man",
  "England, Wales, Northern Ireland and the Channel Islands":
    "L'Angleterre, le pays de Galles, l'Irlande du Nord et les Channel Islands",
  "Northern Ireland, not the whole of Ireland. The Republic of Ireland is a separate country.":
    "L'Irlande du Nord, et non l'Irlande entière. La République d'Irlande est un pays distinct.",
  "What is the capital of Wales?": "Quelle est la capitale du pays de Galles ?",
  "Swansea": "Swansea",
  "Cardiff": "Cardiff",
  "Newport": "Newport",
  "Bangor": "Bangor",
  "Cardiff, home of the Senedd — the Welsh Parliament.":
    "Cardiff, siège du Senedd — le Parlement gallois.",
  "What is the capital of Scotland?": "Quelle est la capitale de l'Écosse ?",
  "Glasgow": "Glasgow",
  "Aberdeen": "Aberdeen",
  "Dundee": "Dundee",
  "Edinburgh, where the Scottish Parliament sits at Holyrood. Glasgow is larger but is not the capital.":
    "Edinburgh, où le Parlement écossais siège à Holyrood. Glasgow est plus grande mais n'est pas la capitale.",
  "Which is the largest city in Scotland?": "Quelle est la plus grande ville d'Écosse ?",
  "Inverness": "Inverness",
  "Glasgow is the largest by population; Edinburgh is the capital. The test likes this split.":
    "Glasgow est la plus grande par la population ; Edinburgh est la capitale. L'examen aime bien cette distinction.",
  "Which mountain is the highest in Wales?":
    "Quelle est la plus haute montagne du pays de Galles ?",
  "Ben Nevis": "Ben Nevis",
  "Scafell Pike": "Scafell Pike",
  "Snowdon": "Snowdon",
  "Slieve Donard": "Slieve Donard",
  "Snowdon — Yr Wyddfa — at 1,085 m. Ben Nevis is Scotland's and the UK's highest.":
    "Snowdon — Yr Wyddfa — à 1 085 m. Ben Nevis est le sommet le plus haut d'Écosse et de tout le Royaume-Uni.",
  "Which is the highest mountain in England?": "Quelle est la plus haute montagne d'Angleterre ?",
  "Helvellyn": "Helvellyn",
  "Scafell Pike in the Lake District, 978 m — the lowest of the four national high points.":
    "Scafell Pike dans le Lake District, 978 m — le plus bas des quatre sommets nationaux.",
  "What is the largest freshwater lake by area in the whole UK?":
    "Quel est le plus grand lac d'eau douce par la superficie dans tout le Royaume-Uni ?",
  "Loch Lomond": "Loch Lomond",
  "Windermere": "Windermere",
  "Lough Neagh": "Lough Neagh",
  "Loch Ness": "Loch Ness",
  "Lough Neagh in Northern Ireland. Loch Lomond is the largest in Great Britain, and Windermere the largest in England.":
    "Lough Neagh en Irlande du Nord. Loch Lomond est le plus grand de Grande-Bretagne, et Windermere le plus grand d'Angleterre.",
  "Which sea lies to the east of Great Britain?":
    "Quelle mer se trouve à l'est de la Grande-Bretagne ?",
  "The Irish Sea": "La mer d'Irlande",
  "The North Sea": "La mer du Nord",
  "The Atlantic Ocean": "L'océan Atlantique",
  "The English Channel": "La Manche",
  "The North Sea to the east, the Channel to the south, the Irish Sea to the west.":
    "La mer du Nord à l'est, la Manche au sud, la mer d'Irlande à l'ouest.",
  "Which of these is a Crown Dependency rather than part of the UK?":
    "Lequel de ces territoires est une Crown Dependency et non une partie du Royaume-Uni ?",
  "Anglesey": "Anglesey",
  "The Isle of Wight": "L'Isle of Wight",
  "The Isles of Scilly": "Les Isles of Scilly",
  "The Isle of Man and the Channel Islands are Crown Dependencies with their own governments. The others are UK islands.":
    "L'Isle of Man et les Channel Islands sont des Crown Dependencies avec leurs propres gouvernements. Les autres sont des îles britanniques.",
  "How many National Parks are there in the UK?":
    "Combien y a-t-il de National Parks au Royaume-Uni ?",
  "15, including the Lake District, Snowdonia, the Cairngorms and the Peak District.":
    "15, dont le Lake District, Snowdonia, les Cairngorms et le Peak District.",
  "Which river flows through London?": "Quel fleuve traverse Londres ?",
  "The Mersey": "La Mersey",
  "The Thames — the second longest river in the UK, after the Severn.":
    "La Tamise — le deuxième plus long cours d'eau du Royaume-Uni, après la Severn.",
  "In which year did the Channel Tunnel open?":
    "En quelle année le Channel Tunnel a-t-il ouvert ?",
  "1984": "1984",
  "1990": "1990",
  "1994": "1994",
  "2000": "2000",
  "1994, linking Folkestone with Coquelles in France — the UK's only fixed land link to the continent.":
    "1994, reliant Folkestone à Coquelles en France — la seule liaison terrestre fixe du Royaume-Uni avec le continent.",
  "Which of these is an official language in Wales?":
    "Laquelle de ces langues est officielle au pays de Galles ?",
  "Gaelic": "Le gaélique",
  "Welsh": "Le gallois",
  "Cornish": "Le cornique",
  "Irish": "L'irlandais",
  "Welsh is official in Wales and taught in schools there. Gaelic is spoken in parts of Scotland, Irish in Northern Ireland.":
    "Le gallois est officiel au pays de Galles et enseigné dans ses écoles. Le gaélique se parle dans certaines régions d'Écosse, l'irlandais en Irlande du Nord.",
  "How many counties does Northern Ireland have?": "Combien de comtés compte l'Irlande du Nord ?",
  "Four": "Quatre",
  "Six": "Six",
  "Six: Antrim, Armagh, Down, Fermanagh, Londonderry and Tyrone.":
    "Six : Antrim, Armagh, Down, Fermanagh, Londonderry et Tyrone.",
  "What is the national flower of England?": "Quelle est la fleur nationale de l'Angleterre ?",
  "The rose — the red and white Tudor rose, from the end of the Wars of the Roses.":
    "La rose — la rose rouge et blanche des Tudors, née de la fin de la guerre des Deux-Roses.",
  "Which plant is the emblem of Scotland?": "Quelle plante est l'emblème de l'Écosse ?",
  "The leek": "Le poireau",
  "The oak": "Le chêne",
  "The thistle, a spiny purple flower, has been Scotland's emblem for centuries.":
    "Le chardon, une fleur violette et piquante, est l'emblème de l'Écosse depuis des siècles.",
  "On what date is St Andrew's Day?": "À quelle date tombe la St Andrew's Day ?",
  "1 March": "Le 1er mars",
  "17 March": "Le 17 mars",
  "23 April": "Le 23 avril",
  "30 November": "Le 30 novembre",
  "30 November, and it is a bank holiday in Scotland.":
    "Le 30 novembre, et c'est un jour férié en Écosse.",
  "St George is the patron saint of which nation?":
    "St George est le saint patron de quelle nation ?",
  "England, celebrated on 23 April. His red cross on white forms part of the Union Flag.":
    "L'Angleterre, fêtée le 23 avril. Sa croix rouge sur fond blanc entre dans l'Union Flag.",
  "Which patron saints' days both fall in March?":
    "Quelles fêtes de saints patrons tombent toutes deux en mars ?",
  "St George and St Andrew": "St George et St Andrew",
  "St David and St Patrick": "St David et St Patrick",
  "St Patrick and St George": "St Patrick et St George",
  "St David and St Andrew": "St David et St Andrew",
  "St David on 1 March and St Patrick on 17 March. These two are the pair most often confused.":
    "St David le 1er mars et St Patrick le 17 mars. Ces deux-là sont la paire que l'on confond le plus souvent.",
  "Which three crosses make up the Union Flag?": "Quelles trois croix composent l'Union Flag ?",
  "St George, St Andrew and St David": "St George, St Andrew et St David",
  "St George, St Andrew and St Patrick": "St George, St Andrew et St Patrick",
  "St Patrick, St David and St Andrew": "St Patrick, St David et St Andrew",
  "St George, St David and St Patrick": "St George, St David et St Patrick",
  "England's St George, Scotland's St Andrew and Ireland's St Patrick. Wales is not represented.":
    "Le St George de l'Angleterre, le St Andrew de l'Écosse et le St Patrick de l'Irlande. Le pays de Galles n'y figure pas.",
  "Why is Wales not represented on the Union Flag?":
    "Pourquoi le pays de Galles ne figure-t-il pas sur l'Union Flag ?",
  "Wales refused to join": "Le pays de Galles a refusé d'y entrer",
  "Wales was already united with England when the flag was designed":
    "Le pays de Galles était déjà uni à l'Angleterre quand le drapeau a été dessiné",
  "The dragon was considered unsuitable": "Le dragon a été jugé inconvenant",
  "Wales joined the UK only in 1900": "Le pays de Galles n'a rejoint le Royaume-Uni qu'en 1900",
  "By 1606 Wales had already been joined to England, so it was not treated as a separate kingdom.":
    "En 1606, le pays de Galles était déjà rattaché à l'Angleterre, et n'a donc pas été traité comme un royaume distinct.",
  "What is the national anthem of the UK?": "Quel est l'hymne national du Royaume-Uni ?",
  "Land of Hope and Glory": "Land of Hope and Glory",
  "God Save the King": "God Save the King",
  "Jerusalem": "Jerusalem",
  "Rule, Britannia!": "Rule, Britannia!",
  "God Save the King — God Save the Queen during a queen's reign. The words follow the monarch's gender.":
    "God Save the King — God Save the Queen sous le règne d'une reine. Les paroles suivent le genre du monarque.",
  "Which animal appears on the flag of Wales?":
    "Quel animal figure sur le drapeau du pays de Galles ?",
  "A lion": "Un lion",
  "A unicorn": "Une licorne",
  "A dragon": "Un dragon",
  "An eagle": "Un aigle",
  "Which two animals support the Royal Coat of Arms?":
    "Quels deux animaux soutiennent le Royal Coat of Arms ?",
  "A lion and a unicorn": "Un lion et une licorne",
  "A lion and a dragon": "Un lion et un dragon",
  "An eagle and a lion": "Un aigle et un lion",
  "A unicorn and a stag": "Une licorne et un cerf",
  "The lion for England and the unicorn for Scotland.":
    "Le lion pour l'Angleterre et la licorne pour l'Écosse.",
  "Which flower is associated with Northern Ireland?":
    "Quelle plante est associée à l'Irlande du Nord ?",
  "The shamrock, the three-leaved clover associated with St Patrick.":
    "Le shamrock, le trèfle à trois feuilles associé à St Patrick.",
  "What does the Scottish flag, the Saltire, look like?":
    "À quoi ressemble le drapeau écossais, le Saltire ?",
  "A red cross on white": "Une croix rouge sur fond blanc",
  "A white diagonal cross on blue": "Une croix diagonale blanche sur fond bleu",
  "A red diagonal cross on white": "Une croix diagonale rouge sur fond blanc",
  "A red dragon on green and white": "Un dragon rouge sur fond vert et blanc",
  "A white diagonal cross — St Andrew's saltire — on a blue background.":
    "Une croix diagonale blanche — le saltire de St Andrew — sur fond bleu.",
  "In which year did Claudius begin the Roman conquest of Britain?":
    "En quelle année Claude a-t-il commencé la conquête romaine de la Bretagne ?",
  "AD 43 under Claudius. Caesar's earlier expedition in 55 BC failed to conquer anything.":
    "En 43 après J.-C., sous Claude. L'expédition antérieure de César, en 55 avant J.-C., n'avait rien conquis.",
  "What happened when Julius Caesar came to Britain in 55 BC?":
    "Que s'est-il passé quand Jules César est venu en Bretagne en 55 avant J.-C. ?",
  "He conquered the whole island": "Il a conquis l'île entière",
  "His expedition failed and Britain was not conquered":
    "Son expédition a échoué et la Bretagne n'a pas été conquise",
  "He built Hadrian's Wall": "Il a bâti Hadrian's Wall",
  "He was defeated by Boudicca": "Il a été battu par Boudicca",
  "Caesar came and left. The conquest began almost a century later under Claudius, in AD 43.":
    "César est venu puis reparti. La conquête a commencé presque un siècle plus tard sous Claude, en 43 après J.-C.",
  "Who built a wall across northern England to keep out the tribes of the north?":
    "Qui a bâti un mur en travers du nord de l'Angleterre pour tenir à l'écart les tribus du nord ?",
  "Julius Caesar": "Jules César",
  "Emperor Hadrian": "L'empereur Hadrien",
  "Hadrian's Wall, begun around AD 122. The Romans never conquered what is now Scotland.":
    "Hadrian's Wall, commencé vers 122 après J.-C. Les Romains n'ont jamais conquis ce qui est aujourd'hui l'Écosse.",
  "Who led a revolt against Roman rule in eastern England?":
    "Qui a mené une révolte contre la domination romaine dans l'est de l'Angleterre ?",
  "Boudicca, queen of the Iceni. Her statue stands on Westminster Bridge in London.":
    "Boudicca, reine des Icènes. Sa statue se dresse sur Westminster Bridge à Londres.",
  "In which year did the Romans leave Britain?":
    "En quelle année les Romains ont-ils quitté la Bretagne ?",
  "AD 597": "En 597 après J.-C.",
  "AD 410, when troops were withdrawn to defend Rome itself.":
    "En 410 après J.-C., quand les troupes ont été retirées pour défendre Rome elle-même.",
  "A Roman legal code": "Un code de lois romain",
  "The law brought by the Normans in 1066": "Le droit apporté par les Normands en 1066",
  "A tax paid to the Vikings": "Un impôt versé aux Vikings",
  "Alfred could not drive the Vikings out entirely, so a boundary was agreed. The north and east kept Danish law.":
    "Alfred n'a pas pu chasser tout à fait les Vikings, et une frontière a donc été convenue. Le nord et l'est ont gardé le droit danois.",
  "Which king defeated the Vikings and agreed the boundary that created the Danelaw?":
    "Quel roi a battu les Vikings et convenu de la frontière qui a créé le Danelaw ?",
  "Harold": "Harold",
  "Canute": "Canute",
  "Edward the Confessor": "Édouard le Confesseur",
  "Alfred the Great, King of Wessex — the only English monarch called 'the Great'.":
    "Alfred le Grand, roi du Wessex — le seul monarque anglais que l'on dise 'le Grand'.",
  "Which prehistoric monument stands in Wiltshire?":
    "Quel monument préhistorique se dresse dans le Wiltshire ?",
  "Hadrian's Wall": "Hadrian's Wall",
  "Stonehenge": "Stonehenge",
  "Skara Brae": "Skara Brae",
  "Maiden Castle": "Maiden Castle",
  "Stonehenge, built in the Stone Age and still a World Heritage Site.":
    "Stonehenge, bâti à l'âge de pierre et toujours inscrit au patrimoine mondial.",
  "Where is the Stone Age settlement of Skara Brae?":
    "Où se trouve le village de l'âge de pierre de Skara Brae ?",
  "Cornwall": "Les Cornouailles",
  "Orkney": "Les Orkney",
  "Skara Brae is in Orkney, off the north coast of Scotland.":
    "Skara Brae se trouve aux Orkney, au large de la côte nord de l'Écosse.",
  "The languages of which people gave rise to modern Welsh, Gaelic and Irish?":
    "Les langues de quel peuple ont donné le gallois, le gaélique et l'irlandais d'aujourd'hui ?",
  "The Celts": "Les Celtes",
  "The Vikings": "Les Vikings",
  "The Celts of the Iron Age. Their languages survive in Wales, Scotland and Ireland.":
    "Les Celtes de l'âge du fer. Leurs langues survivent au pays de Galles, en Écosse et en Irlande.",
  "Where does the name 'England' come from?": "D'où vient le nom 'England' ?",
  "The Angles, one of the tribes who settled after the Romans":
    "Des Angles, l'une des tribus installées après les Romains",
  "A Roman province called Anglia": "D'une province romaine appelée Anglia",
  "The Norman word for island": "Du mot normand pour île",
  "A Viking king named Engle": "D'un roi viking nommé Engle",
  "Angles, Saxons and Jutes settled after AD 410. 'Angle-land' became England.":
    "Angles, Saxons et Jutes se sont installés après 410 après J.-C. 'Angle-land' est devenu England.",
  "In which year was the Battle of Hastings?": "En quelle année a eu lieu la Battle of Hastings ?",
  "1066 — William of Normandy defeated Harold. It is the last successful invasion of Britain.":
    "1066 — Guillaume de Normandie a battu Harold. C'est la dernière invasion réussie de la Grande-Bretagne.",
  "Who founded a monastery on Iona and helped convert Scotland to Christianity?":
    "Qui a fondé un monastère à Iona et contribué à convertir l'Écosse au christianisme ?",
  "St Augustine": "St Augustine",
  "St Columba in Scotland; St Augustine did the same in the south and became the first Archbishop of Canterbury.":
    "St Columba en Écosse ; St Augustine a fait de même dans le sud et est devenu le premier Archbishop of Canterbury.",
  "In which year was Magna Carta agreed?": "En quelle année Magna Carta a-t-elle été accordée ?",
  "1215 at Runnymede, forced on King John by his barons.":
    "En 1215 à Runnymede, imposée à King John par ses barons.",
  "What principle did Magna Carta establish?": "Quel principe Magna Carta a-t-elle établi ?",
  "That everyone could vote": "Que tout le monde pouvait voter",
  "That the king was subject to the law": "Que le roi était soumis à la loi",
  "That Parliament chose the monarch": "Que le Parlement choisissait le monarque",
  "The king was bound by law and could not tax at will. It did not create Parliament or give anyone the vote.":
    "Le roi était tenu par la loi et ne pouvait plus lever l'impôt à sa guise. Elle n'a pas créé le Parlement ni donné le droit de vote à quiconque.",
  "What was the Domesday Book?": "Qu'était le Domesday Book ?",
  "A record of church law": "Un recueil de droit ecclésiastique",
  "A survey of land ownership and value across England":
    "Un relevé de la propriété foncière et de sa valeur dans toute l'Angleterre",
  "A list of English kings": "Une liste des rois anglais",
  "The first English dictionary": "Le premier dictionnaire anglais",
  "Ordered by William the Conqueror in 1086 to record who owned what and what it was worth.":
    "Commandé par Guillaume le Conquérant en 1086 pour consigner qui possédait quoi et ce que cela valait.",
  "Who won the Battle of Bannockburn in 1314?": "Qui a gagné la Battle of Bannockburn en 1314 ?",
  "Henry V": "Henry V",
  "Robert the Bruce, securing Scottish independence. Wallace had led the earlier resistance and was executed in 1305.":
    "Robert the Bruce, assurant l'indépendance de l'Écosse. Wallace avait mené la résistance antérieure et fut exécuté en 1305.",
  "Which king conquered Wales and built a ring of castles there?":
    "Quel roi a conquis le pays de Galles et y a bâti une ceinture de châteaux ?",
  "Henry II": "Henry II",
  "Richard I": "Richard I",
  "King John": "King John",
  "Edward I. The Statute of Rhuddlan of 1284 annexed Wales to the English Crown.":
    "Edward I. Le Statute of Rhuddlan de 1284 a rattaché le pays de Galles à la Couronne anglaise.",
  "Roughly how much of Britain's population died in the Black Death?":
    "Quelle part environ de la population de Grande-Bretagne est morte de la peste noire ?",
  "A tenth": "Un dixième",
  "A third": "Un tiers",
  "A half": "La moitié",
  "Two thirds": "Deux tiers",
  "About a third, from 1348. The resulting shortage of labour helped end the feudal system.":
    "Environ un tiers, à partir de 1348. Le manque de bras qui a suivi a contribué à la fin du système féodal.",
  "What triggered the Peasants' Revolt of 1381?":
    "Qu'est-ce qui a déclenché la révolte des paysans de 1381 ?",
  "A new poll tax": "Un nouvel impôt par tête",
  "The Black Death": "La peste noire",
  "The loss of France": "La perte de la France",
  "The murder of Thomas Becket": "Le meurtre de Thomas Becket",
  "A poll tax imposed after the Black Death. The revolt was led by Wat Tyler.":
    "Un impôt par tête imposé après la peste noire. La révolte fut menée par Wat Tyler.",
  "How long did the Hundred Years War last?": "Combien de temps a duré la guerre de Cent Ans ?",
  "Exactly 100 years": "Exactement 100 ans",
  "From 1337 to 1453": "De 1337 à 1453",
  "From 1215 to 1315": "De 1215 à 1315",
  "From 1485 to 1585": "De 1485 à 1585",
  "1337 to 1453 — 116 years, on and off, despite the name.":
    "De 1337 à 1453 — 116 ans, par intermittence, malgré le nom.",
  "Which houses fought the Wars of the Roses?":
    "Quelles maisons se sont affrontées dans la guerre des Deux-Roses ?",
  "Tudor and Stuart": "Tudor et Stuart",
  "Lancaster and York": "Lancaster et York",
  "York and Normandy": "York et Normandie",
  "Wessex and Mercia": "Wessex et Mercie",
  "Lancaster (red rose) and York (white rose). The Tudor rose combined both after 1485.":
    "Lancaster (rose rouge) et York (rose blanche). La rose Tudor a réuni les deux après 1485.",
  "Which battle ended the Wars of the Roses in 1485?":
    "Quelle bataille a mis fin à la guerre des Deux-Roses en 1485 ?",
  "Agincourt": "Agincourt",
  "Bosworth Field": "Bosworth Field",
  "Bannockburn": "Bannockburn",
  "Hastings": "Hastings",
  "Bosworth Field. Richard III was killed and Henry Tudor became Henry VII.":
    "Bosworth Field. Richard III y fut tué et Henry Tudor devint Henry VII.",
  "Who was murdered in Canterbury Cathedral in 1170?":
    "Qui a été assassiné dans la cathédrale de Canterbury en 1170 ?",
  "Thomas Becket": "Thomas Becket",
  "Wat Tyler": "Wat Tyler",
  "Thomas Becket, Archbishop of Canterbury, after quarrelling with Henry II.":
    "Thomas Becket, Archbishop of Canterbury, après s'être brouillé avec Henry II.",
  "Which English king won the Battle of Agincourt in 1415?":
    "Quel roi anglais a gagné la Battle of Agincourt en 1415 ?",
  "Edward III": "Edward III",
  "Henry V. Despite such victories, England ended the Hundred Years War holding only Calais.":
    "Henry V. Malgré de telles victoires, l'Angleterre a fini la guerre de Cent Ans en ne tenant plus que Calais.",
  "Which king spent almost his entire reign abroad on crusade?":
    "Quel roi a passé presque tout son règne au loin, en croisade ?",
  "Richard I, the Lionheart. His brother John succeeded him and was forced to accept Magna Carta.":
    "Richard I, Cœur de Lion. Son frère John lui a succédé et a dû accepter Magna Carta.",
  "How many wives did Henry VIII have?": "Combien d'épouses Henry VIII a-t-il eues ?",
  "Six: divorced, beheaded, died; divorced, beheaded, survived.":
    "Six : répudiée, décapitée, morte ; répudiée, décapitée, survivante.",
  "He converted to Protestantism by conviction":
    "Il s'est converti au protestantisme par conviction",
  "Parliament voted to leave": "Le Parlement a voté la rupture",
  "He was excommunicated for heresy": "Il a été excommunié pour hérésie",
  "The break began as a dispute over his first marriage. He made himself Head of the Church of England.":
    "La rupture est née d'une querelle sur son premier mariage. Il s'est fait Head of the Church of England.",
  "In which year was the Spanish Armada defeated?":
    "En quelle année l'Invincible Armada a-t-elle été battue ?",
  "1558": "1558",
  "1588 — beaten off by the English navy and then scattered by storms.":
    "1588 — repoussée par la marine anglaise puis dispersée par les tempêtes.",
  "Which of Henry VIII's wives was the mother of Elizabeth I?":
    "Laquelle des épouses de Henry VIII était la mère d'Elizabeth I ?",
  "Anne Boleyn, who was beheaded. Catherine of Aragon was Mary I's mother and Jane Seymour Edward VI's.":
    "Anne Boleyn, qui fut décapitée. Catherine of Aragon était la mère de Mary I, et Jane Seymour celle d'Edward VI.",
  "Oxford": "Oxford",
  "Stratford-upon-Avon in 1564. He worked in London, at the Globe Theatre.":
    "Stratford-upon-Avon en 1564. Il a travaillé à Londres, au Globe Theatre.",
  "Which monarch was known as 'Bloody Mary'?": "Quel monarque était surnommé 'Bloody Mary' ?",
  "Mary II": "Mary II",
  "Mary, Queen of Scots": "Mary, Queen of Scots",
  "Mary I, a devout Catholic who reversed the Reformation and had Protestants executed.":
    "Mary I, catholique fervente qui a défait la Réforme et fait exécuter des protestants.",
  "What was the Dissolution of the Monasteries?": "Qu'était la Dissolution of the Monasteries ?",
  "The closing of monasteries and seizure of their wealth by the Crown":
    "La fermeture des monastères et la saisie de leurs biens par la Couronne",
  "A new set of monastic rules": "Un nouveau règlement monastique",
  "The founding of new monasteries": "La fondation de nouveaux monastères",
  "A tax on the Church paid to Rome": "Un impôt sur l'Église versé à Rome",
  "It followed Henry VIII's break with Rome and transferred great wealth to the Crown.":
    "Elle a suivi la rupture de Henry VIII avec Rome et a fait passer d'immenses richesses à la Couronne.",
  "How long did Elizabeth I reign?": "Combien de temps Elizabeth I a-t-elle régné ?",
  "About 20 years": "Environ 20 ans",
  "About 45 years": "Environ 45 ans",
  "About 60 years": "Environ 60 ans",
  "About 70 years": "Environ 70 ans",
  "45 years. She never married and found a religious middle way that largely held.":
    "45 ans. Elle ne s'est jamais mariée et a trouvé en matière de religion une voie moyenne qui a largement tenu.",
  "Which Tudor king ended the Wars of the Roses and founded the dynasty?":
    "Quel roi Tudor a mis fin à la guerre des Deux-Roses et fondé la dynastie ?",
  "Henry VII": "Henry VII",
  "Richard III": "Richard III",
  "Henry VII won at Bosworth Field in 1485.": "Henry VII l'a emporté à Bosworth Field en 1485.",
  "Whose son became James VI of Scotland and then James I of England?":
    "De qui le fils est-il devenu James VI d'Écosse puis James I d'Angleterre ?",
  "Mary, Queen of Scots, executed in 1587. Her son united the two crowns in 1603.":
    "Mary, Queen of Scots, exécutée en 1587. Son fils a réuni les deux couronnes en 1603.",
  "Which of these plays did Shakespeare write?":
    "Laquelle de ces œuvres Shakespeare a-t-il écrite ?",
  "The Canterbury Tales": "The Canterbury Tales",
  "Macbeth": "Macbeth",
  "Paradise Lost": "Paradise Lost",
  "Oliver Twist": "Oliver Twist",
  "Macbeth. The Canterbury Tales is Chaucer, Paradise Lost is Milton, Oliver Twist is Dickens.":
    "Macbeth. The Canterbury Tales est de Chaucer, Paradise Lost de Milton, Oliver Twist de Dickens.",
  "Which Tudor monarch died at the age of 15?": "Quel monarque Tudor est mort à quinze ans ?",
  "Edward VI, Henry VIII's only surviving son. The Book of Common Prayer dates from his reign.":
    "Edward VI, le seul fils survivant de Henry VIII. Le Book of Common Prayer date de son règne.",
  "What is remembered every year on 5 November?":
    "Que commémore-t-on chaque année le 5 novembre ?",
  "The failure of the Gunpowder Plot": "L'échec du Gunpowder Plot",
  "The execution of Charles I": "L'exécution de Charles I",
  "Guy Fawkes and his fellow plotters failed to blow up Parliament in 1605.":
    "Guy Fawkes et ses complices n'ont pas réussi à faire sauter le Parlement en 1605.",
  "Who were the Cavaliers?": "Qui étaient les Cavaliers ?",
  "Members of the Gunpowder Plot": "Les membres du Gunpowder Plot",
  "Cavaliers, or Royalists, supported Charles I. The Roundheads supported Parliament.":
    "Les Cavaliers, ou royalistes, soutenaient Charles I. Les Roundheads soutenaient le Parlement.",
  "In which year was Charles I executed?": "En quelle année Charles I a-t-il été exécuté ?",
  "1642": "1642",
  "1649 — the only English king put to death by his own subjects.":
    "1649 — le seul roi anglais mis à mort par ses propres sujets.",
  "What title did Oliver Cromwell hold?": "Quel titre portait Oliver Cromwell ?",
  "King of England": "Roi d'Angleterre",
  "Lord Protector": "Lord Protector",
  "Prime Minister": "Premier ministre",
  "Lord Chancellor": "Lord Chancellor",
  "Lord Protector of the Commonwealth. He refused the crown.":
    "Lord Protector of the Commonwealth. Il a refusé la couronne.",
  "What was the Restoration of 1660?": "Qu'était la Restoration de 1660 ?",
  "Parliament inviting Charles II back to the throne":
    "Le Parlement rappelant Charles II sur le trône",
  "The rebuilding of London after the fire": "La reconstruction de Londres après l'incendie",
  "The return of Catholicism": "Le retour du catholicisme",
  "The reopening of the monasteries": "La réouverture des monastères",
  "After Cromwell's death Parliament invited Charles II to return, ending the republic.":
    "Après la mort de Cromwell, le Parlement a rappelé Charles II, mettant fin à la république.",
  "Votes for all men over 21": "Le droit de vote pour tous les hommes de plus de 21 ans",
  "The union of England and Scotland": "L'union de l'Angleterre et de l'Écosse",
  "Freedom of religion for Catholics": "La liberté de religion pour les catholiques",
  "It made the monarchy constitutional: no taxation or standing army without Parliament, regular parliaments, free elections.":
    "Il a rendu la monarchie constitutionnelle : ni impôt ni armée permanente sans le Parlement, des parlements réguliers, des élections libres.",
  "Why is the change of monarch in 1688 called the Glorious Revolution?":
    "Pourquoi le changement de monarque de 1688 s'appelle-t-il la Glorious Revolution ?",
  "It gave ordinary people the vote": "Elle a donné le droit de vote aux gens ordinaires",
  "It ended a war with France": "Elle a mis fin à une guerre avec la France",
  "James II fled rather than fight, so the throne changed hands without a battle in England.":
    "James II a fui plutôt que de combattre, et le trône a donc changé de mains sans bataille en Angleterre.",
  "Which two monarchs ruled jointly after the Glorious Revolution?":
    "Quels deux monarques ont régné ensemble après la Glorious Revolution ?",
  "William III and Mary II": "William III et Mary II",
  "Charles II and James II": "Charles II et James II",
  "James I and Charles I": "James I et Charles I",
  "Mary I and Elizabeth I": "Mary I et Elizabeth I",
  "William of Orange and his wife Mary, James II's Protestant daughter.":
    "Guillaume d'Orange et son épouse Mary, la fille protestante de James II.",
  "In which year was the Great Fire of London?":
    "En quelle année a eu lieu le Great Fire of London ?",
  "1665": "1665",
  "1666, the year after the Great Plague of 1665.":
    "1666, l'année qui a suivi la Great Plague de 1665.",
  "What did Charles I believe about his authority?":
    "Que croyait Charles I au sujet de son autorité ?",
  "That it came from Parliament": "Qu'elle venait du Parlement",
  "That it came from God — the divine right of kings":
    "Qu'elle venait de Dieu — le droit divin des rois",
  "That it came from the Church of England": "Qu'elle venait de la Church of England",
  "That it could be voted on": "Qu'elle pouvait être mise aux voix",
  "The divine right of kings. He ruled eleven years without calling Parliament, and the quarrel became war in 1642.":
    "Le droit divin des rois. Il a gouverné onze ans sans convoquer le Parlement, et la querelle est devenue guerre en 1642.",
  "Which Bible translation was ordered by James I?":
    "Quelle traduction de la Bible James I a-t-il commandée ?",
  "The Book of Common Prayer": "The Book of Common Prayer",
  "The King James Bible": "The King James Bible",
  "The Geneva Bible": "The Geneva Bible",
  "The Great Bible": "The Great Bible",
  "The King James Bible, still the best-known English translation.":
    "The King James Bible, encore aujourd'hui la traduction anglaise la plus connue.",
  "Which scientific institution was founded during the reign of Charles II?":
    "Quelle institution savante a été fondée sous le règne de Charles II ?",
  "The Royal Society": "The Royal Society",
  "The British Museum": "The British Museum",
  "The National Gallery": "The National Gallery",
  "The Royal Institution": "The Royal Institution",
  "The Royal Society, Britain's oldest scientific institution, founded in the 1660s.":
    "The Royal Society, la plus ancienne institution savante de Grande-Bretagne, fondée dans les années 1660.",
  "What did the Act of Union of 1707 create?": "Qu'a créé l'Act of Union de 1707 ?",
  "The United Kingdom": "Le Royaume-Uni",
  "The Kingdom of Great Britain": "Le royaume de Grande-Bretagne",
  "The Commonwealth": "Le Commonwealth",
  "The British Empire": "L'Empire britannique",
  "It joined the parliaments of England and Scotland as Great Britain. Ireland was added in 1801, creating the UK.":
    "Il a réuni les parlements d'Angleterre et d'Écosse sous le nom de Grande-Bretagne. L'Irlande s'y est ajoutée en 1801, créant le Royaume-Uni.",
  "Which Act of Union created the United Kingdom by adding Ireland?":
    "Quel Act of Union a créé le Royaume-Uni en y ajoutant l'Irlande ?",
  "The Act of 1707": "Celui de 1707",
  "The Act of 1801": "Celui de 1801",
  "The Act of 1832": "Celui de 1832",
  "The Act of 1922": "Celui de 1922",
  "1707 made Great Britain; 1801 added Ireland and made it the United Kingdom.":
    "1707 a fait la Grande-Bretagne ; 1801 y a ajouté l'Irlande et en a fait le Royaume-Uni.",
  "Which battle in 1746 was the last fought on British soil?":
    "Quelle bataille de 1746 fut la dernière livrée sur le sol britannique ?",
  "Culloden": "Culloden",
  "Waterloo": "Waterloo",
  "Trafalgar": "Trafalgar",
  "Culloden, where the Jacobite rising under Bonnie Prince Charlie was crushed.":
    "Culloden, où le soulèvement jacobite mené par Bonnie Prince Charlie fut écrasé.",
  "Which Act abolished slavery throughout the British Empire?":
    "Quelle loi a aboli l'esclavage dans tout l'Empire britannique ?",
  "1807 ended the slave trade; 1833 abolished slavery itself and freed those already enslaved.":
    "1807 a mis fin à la traite ; 1833 a aboli l'esclavage lui-même et libéré ceux qui étaient déjà réduits en esclavage.",
  "What did the Act of 1807 abolish?": "Qu'a aboli la loi de 1807 ?",
  "Slavery itself throughout the Empire": "L'esclavage lui-même dans tout l'Empire",
  "The slave trade — the buying and carrying of enslaved people":
    "La traite — l'achat et le transport des personnes réduites en esclavage",
  "Child labour in factories": "Le travail des enfants dans les usines",
  "The East India Company": "The East India Company",
  "1807 stopped the trade. Slavery itself continued until the Act of 1833.":
    "1807 a arrêté la traite. L'esclavage lui-même a duré jusqu'à la loi de 1833.",
  "Who led the parliamentary campaign against the slave trade?":
    "Qui a mené au Parlement la campagne contre la traite ?",
  "Robert Peel": "Robert Peel",
  "Wilberforce, supported by the Quakers among others.":
    "Wilberforce, soutenu entre autres par les quakers.",
  "Who commanded the British fleet at Trafalgar in 1805?":
    "Qui commandait la flotte britannique à Trafalgar en 1805 ?",
  "Captain Cook": "Captain Cook",
  "Sir Francis Drake": "Sir Francis Drake",
  "Nelson won and was killed in the battle. Nelson's Column stands in Trafalgar Square.":
    "Nelson a gagné et a été tué dans la bataille. Nelson's Column se dresse à Trafalgar Square.",
  "Who finally defeated Napoleon at Waterloo in 1815?":
    "Qui a fini par battre Napoléon à Waterloo en 1815 ?",
  "William Pitt": "William Pitt",
  "George III": "George III",
  "Wellington beat Napoleon on land, ten years after Nelson had beaten the French at sea.":
    "Wellington a battu Napoléon sur terre, dix ans après que Nelson eut battu les Français sur mer.",
  "From 1760 to 1820": "De 1760 à 1820",
  "64 years — the second longest reign, after Elizabeth II.":
    "64 ans — le deuxième règne le plus long, après celui d'Elizabeth II.",
  "Who improved the steam engine and made industrial power practical?":
    "Qui a perfectionné la machine à vapeur et rendu la force industrielle utilisable ?",
  "James Watt. Stephenson built the Rocket and the first passenger railways.":
    "James Watt. Stephenson a construit la Rocket et les premiers chemins de fer de voyageurs.",
  "Who founded modern nursing during the Crimean War?":
    "Qui a fondé les soins infirmiers modernes pendant la guerre de Crimée ?",
  "Elizabeth Fry": "Elizabeth Fry",
  "Mary Seacole": "Mary Seacole",
  "Florence Nightingale, who set up the first nursing school at St Thomas' Hospital in London.":
    "Florence Nightingale, qui a ouvert la première école d'infirmières au St Thomas' Hospital à Londres.",
  "What did Charles Darwin publish in 1859?": "Qu'a publié Charles Darwin en 1859 ?",
  "Principia Mathematica": "Principia Mathematica",
  "On the Origin of Species": "On the Origin of Species",
  "The Wealth of Nations": "The Wealth of Nations",
  "A Christmas Carol": "A Christmas Carol",
  "On the Origin of Species, setting out evolution by natural selection.":
    "On the Origin of Species, où il expose l'évolution par la sélection naturelle.",
  "What was displayed at the Great Exhibition of 1851?":
    "Qu'a-t-on montré à la Great Exhibition de 1851 ?",
  "British industrial and imperial achievement, in the Crystal Palace":
    "La réussite industrielle et impériale britannique, au Crystal Palace",
  "The Crown Jewels": "Les Crown Jewels",
  "Paintings from the National Gallery": "Des tableaux de la National Gallery",
  "The first railway engines only": "Les premières locomotives, et rien d'autre",
  "It showcased Britain at the height of its industrial power, in the purpose-built Crystal Palace.":
    "Elle a montré la Grande-Bretagne au sommet de sa puissance industrielle, dans le Crystal Palace bâti pour l'occasion.",
  "In which year did the American colonies declare independence?":
    "En quelle année les colonies américaines ont-elles déclaré leur indépendance ?",
  "1776. Britain lost its most valuable settler colonies.":
    "1776. La Grande-Bretagne a perdu ses colonies de peuplement les plus précieuses.",
  "Which engineer built the Great Western Railway and the Clifton Suspension Bridge?":
    "Quel ingénieur a construit le Great Western Railway et le Clifton Suspension Bridge ?",
  "Thomas Telford": "Thomas Telford",
  "Brunel — railways, bridges, tunnels and pioneering steamships.":
    "Brunel — chemins de fer, ponts, tunnels et navires à vapeur d'avant-garde.",
  "On what date did the First World War end?":
    "À quelle date la Première Guerre mondiale a-t-elle pris fin ?",
  "8 May 1918": "Le 8 mai 1918",
  "11 November 1918": "Le 11 novembre 1918",
  "1 September 1939": "Le 1er septembre 1939",
  "6 June 1944": "Le 6 juin 1944",
  "11 November 1918 — which is why Remembrance Day falls on that date.":
    "Le 11 novembre 1918 — c'est pourquoi le Remembrance Day tombe à cette date.",
  "In which year did women get the vote on the same terms as men?":
    "En quelle année les femmes ont-elles obtenu le droit de vote aux mêmes conditions que les hommes ?",
  "1918 gave the vote to women over 30 with a property qualification; 1928 brought full equality at 21.":
    "1918 a donné le vote aux femmes de plus de 30 ans remplissant une condition de propriété ; 1928 a apporté l'égalité entière à 21 ans.",
  "What did the Representation of the People Act of 1918 do for women?":
    "Qu'a fait le Representation of the People Act de 1918 pour les femmes ?",
  "Gave all women over 21 the vote": "Il a donné le vote à toutes les femmes de plus de 21 ans",
  "Gave women over 30 who met a property qualification the vote":
    "Il a donné le vote aux femmes de plus de 30 ans remplissant une condition de propriété",
  "Gave no women the vote": "Il n'a donné le vote à aucune femme",
  "Allowed women to stand for Parliament only":
    "Il a seulement permis aux femmes de se présenter au Parlement",
  "Over 30, and with property. Equality with men at 21 waited another ten years, until 1928.":
    "Plus de 30 ans, et avec des biens. L'égalité avec les hommes à 21 ans a attendu dix ans de plus, jusqu'en 1928.",
  "Who led the suffragette campaign for votes for women?":
    "Qui a mené la campagne des suffragettes pour le vote des femmes ?",
  "Emmeline Pankhurst. The campaign used protests, hunger strikes and imprisonment.":
    "Emmeline Pankhurst. La campagne est passée par les manifestations, les grèves de la faim et la prison.",
  "Who was Prime Minister for most of the Second World War?":
    "Qui a été Premier ministre pendant l'essentiel de la Seconde Guerre mondiale ?",
  "Churchill became Prime Minister in 1940 and led Britain for the rest of the war.":
    "Churchill est devenu Premier ministre en 1940 et a conduit la Grande-Bretagne jusqu'à la fin de la guerre.",
  "What was the Battle of Britain?": "Qu'était la Battle of Britain ?",
  "A naval battle in the Atlantic": "Une bataille navale dans l'Atlantique",
  "The RAF holding off the German air force in 1940":
    "La RAF tenant en échec l'aviation allemande en 1940",
  "The Allied landings in Normandy": "Le débarquement allié en Normandie",
  "The bombing of London": "Le bombardement de Londres",
  "The air battle of 1940 that prevented invasion. The Blitz was the bombing of British cities.":
    "La bataille aérienne de 1940 qui a empêché l'invasion. Le Blitz, lui, était le bombardement des villes britanniques.",
  "What happened on 6 June 1944?": "Que s'est-il passé le 6 juin 1944 ?",
  "VE Day": "Le VE Day",
  "The D-Day landings in Normandy": "Le débarquement du D-Day en Normandie",
  "The start of the Blitz": "Le début du Blitz",
  "The evacuation from Dunkirk": "L'évacuation de Dunkerque",
  "D-Day — the Allied landings that opened the campaign to liberate western Europe.":
    "Le D-Day — le débarquement allié qui a ouvert la campagne de libération de l'Europe de l'Ouest.",
  "Bevan as Health Minister. Beveridge wrote the 1942 report; Attlee was the Prime Minister of the day.":
    "Bevan, comme ministre de la Santé. Beveridge avait écrit le rapport de 1942 ; Attlee était le Premier ministre de l'époque.",
  "What did the Beveridge Report of 1942 identify?": "Qu'a désigné le Beveridge Report de 1942 ?",
  "Five giants: want, disease, ignorance, squalor and idleness":
    "Cinq géants : le besoin, la maladie, l'ignorance, l'insalubrité et l'oisiveté",
  "The causes of the war": "Les causes de la guerre",
  "A plan for decolonisation": "Un plan de décolonisation",
  "The structure of the Commonwealth": "L'organisation du Commonwealth",
  "Those five giants became the target of the post-war welfare state.":
    "Ces cinq géants sont devenus la cible de l'État-providence d'après-guerre.",
  "Which ship gave its name to a generation of post-war arrivals from the Caribbean?":
    "Quel navire a donné son nom à une génération d'arrivants des Caraïbes après la guerre ?",
  "The Empire Windrush": "L'Empire Windrush",
  "The Mayflower": "Le Mayflower",
  "HMS Victory": "Le HMS Victory",
  "The Cutty Sark": "Le Cutty Sark",
  "The Empire Windrush arrived in 1948, the same year the NHS was founded.":
    "L'Empire Windrush est arrivé en 1948, l'année même où le NHS a été fondé.",
  "The referendum was June 2016; the UK left on 31 January 2020, with a transition period to year end.":
    "Le référendum a eu lieu en juin 2016 ; le Royaume-Uni est sorti le 31 janvier 2020, avec une période de transition jusqu'à la fin de l'année.",
  "In which year did the UK join the European Economic Community?":
    "En quelle année le Royaume-Uni est-il entré dans la Communauté économique européenne ?",
  "1957": "1957",
  "1973. The EEC later became the European Union.":
    "1973. La CEE est devenue plus tard l'Union européenne.",
  "Who became the first woman Prime Minister of the UK?":
    "Qui est devenue la première femme Premier ministre du Royaume-Uni ?",
  "Barbara Castle": "Barbara Castle",
  "Margaret Thatcher in 1979. Theresa May was the second, in 2016.":
    "Margaret Thatcher en 1979. Theresa May fut la deuxième, en 2016.",
  "Which agreement of 1998 brought peace to Northern Ireland?":
    "Quel accord de 1998 a ramené la paix en Irlande du Nord ?",
  "The Good Friday Agreement": "Le Good Friday Agreement",
  "The Anglo-Irish Agreement": "L'Anglo-Irish Agreement",
  "The Treaty of Rome": "Le traité de Rome",
  "The Act of Union": "L'Act of Union",
  "The Good Friday Agreement, which also created the power-sharing Northern Ireland Assembly.":
    "Le Good Friday Agreement, qui a aussi créé la Northern Ireland Assembly au pouvoir partagé.",
  "Which countries became independent in 1947, beginning decolonisation?":
    "Quels pays sont devenus indépendants en 1947, ouvrant la décolonisation ?",
  "Kenya and Nigeria": "Le Kenya et le Nigeria",
  "India and Pakistan": "L'Inde et le Pakistan",
  "Australia and New Zealand": "L'Australie et la Nouvelle-Zélande",
  "Jamaica and Barbados": "La Jamaïque et la Barbade",
  "India and Pakistan first, then most of Africa and the Caribbean. Many joined the Commonwealth.":
    "L'Inde et le Pakistan d'abord, puis la plus grande partie de l'Afrique et des Caraïbes. Beaucoup ont rejoint le Commonwealth.",
  "Where did codebreakers work to break German ciphers in the Second World War?":
    "Où les décrypteurs ont-ils travaillé à percer les codes allemands pendant la Seconde Guerre mondiale ?",
  "Bletchley Park": "Bletchley Park",
  "Chequers": "Chequers",
  "Portsmouth": "Portsmouth",
  "Sandhurst": "Sandhurst",
  "Bletchley Park, where Alan Turing and others shortened the war.":
    "Bletchley Park, où Alan Turing et d'autres ont raccourci la guerre.",
  "Which came first: Magna Carta or the Battle of Hastings?":
    "Qu'est-ce qui est venu en premier : Magna Carta ou la Battle of Hastings ?",
  "The Battle of Hastings": "La Battle of Hastings",
  "Magna Carta came first, by two centuries":
    "Magna Carta est venue en premier, avec deux siècles d'avance",
  "Hastings 1066, Magna Carta 1215 — the Conquest comes first, by about 150 years.":
    "Hastings en 1066, Magna Carta en 1215 — la Conquête vient en premier, avec environ 150 ans d'avance.",
  "Put these in order: the Spanish Armada, the Great Fire of London, the Act of Union with Scotland.":
    "Mettez ces événements dans l'ordre : l'Invincible Armada, le Great Fire of London, l'Act of Union avec l'Écosse.",
  "Armada, Great Fire, Act of Union": "Armada, Great Fire, Act of Union",
  "Great Fire, Armada, Act of Union": "Great Fire, Armada, Act of Union",
  "Act of Union, Armada, Great Fire": "Act of Union, Armada, Great Fire",
  "Armada, Act of Union, Great Fire": "Armada, Act of Union, Great Fire",
  "Armada 1588, Great Fire 1666, Act of Union 1707.":
    "L'Armada en 1588, le Great Fire en 1666, l'Act of Union en 1707.",
  "Which happened first: the founding of the NHS or the end of the Second World War?":
    "Qu'est-ce qui est arrivé en premier : la fondation du NHS ou la fin de la Seconde Guerre mondiale ?",
  "The end of the war": "La fin de la guerre",
  "The same year": "La même année",
  "The NHS, by ten years": "Le NHS, avec dix ans d'avance",
  "The war ended in 1945; the NHS opened in 1948, built by the government elected afterwards.":
    "La guerre s'est terminée en 1945 ; le NHS a ouvert en 1948, bâti par le gouvernement élu ensuite.",
  "Which of these happened in 1689?": "Lequel de ces événements a eu lieu en 1689 ?",
  "The Glorious Revolution": "La Glorious Revolution",
  "The Glorious Revolution was 1688; the Bill of Rights that settled its terms was 1689.":
    "La Glorious Revolution date de 1688 ; le Bill of Rights qui en a fixé les termes date de 1689.",
  "In which year did the Romans first successfully invade Britain?":
    "En quelle année les Romains ont-ils envahi la Bretagne avec succès pour la première fois ?",
  "AD 43 under Claudius. 55 BC was Caesar's failed expedition; AD 122 Hadrian's Wall; AD 410 the departure.":
    "En 43 après J.-C., sous Claude. 55 avant J.-C. fut l'expédition manquée de César ; 122 après J.-C. Hadrian's Wall ; 410 après J.-C. le départ.",
  "Which came first: the abolition of the slave trade or the Battle of Waterloo?":
    "Qu'est-ce qui est venu en premier : l'abolition de la traite ou la bataille de Waterloo ?",
  "The abolition of the slave trade, in 1807": "L'abolition de la traite, en 1807",
  "Waterloo, in 1815": "Waterloo, en 1815",
  "They happened the same year": "Les deux la même année",
  "Waterloo, by twenty years": "Waterloo, avec vingt ans d'avance",
  "The slave trade was abolished in 1807, eight years before Waterloo in 1815.":
    "La traite a été abolie en 1807, huit ans avant Waterloo en 1815.",
  "In which year did London most recently host the Olympic Games?":
    "En quelle année Londres a-t-elle accueilli les Jeux olympiques la dernière fois ?",
  "2012. London has hosted three times — 1908, 1948 and 2012 — more than any other city.":
    "2012. Londres les a accueillis trois fois — en 1908, 1948 et 2012 — plus que toute autre ville.",
  "In which year did Queen Elizabeth II die?":
    "En quelle année la reine Elizabeth II est-elle morte ?",
  "2021": "2021",
  "2023": "2023",
  "September 2022, after 70 years — the longest reign in British history. Charles III succeeded her.":
    "En septembre 2022, après 70 ans — le règne le plus long de l'histoire britannique. Charles III lui a succédé.",
  "Which came first: the Peasants' Revolt or the Black Death?":
    "Qu'est-ce qui est venu en premier : la révolte des paysans ou la peste noire ?",
  "The Peasants' Revolt": "La révolte des paysans",
  "The Peasants' Revolt, by fifty years": "La révolte des paysans, avec cinquante ans d'avance",
  "The Black Death arrived in 1348; the revolt followed in 1381, triggered by a poll tax imposed afterwards.":
    "La peste noire est arrivée en 1348 ; la révolte a suivi en 1381, déclenchée par un impôt par tête imposé ensuite.",
  "In which year did the Scottish Parliament and the Welsh Assembly first sit?":
    "En quelle année le Parlement écossais et la Welsh Assembly ont-ils siégé pour la première fois ?",
  "1999, after referendums in 1997.": "En 1999, après les référendums de 1997.",
  "Which of these is the oldest?": "Lequel de ces monuments est le plus ancien ?",
  "The Tower of London": "La Tower of London",
  "Edinburgh Castle": "Edinburgh Castle",
  "Stonehenge, from about 2500 BC — over two thousand years older than Hadrian's Wall.":
    "Stonehenge, vers 2500 avant J.-C. — plus de deux mille ans de plus que Hadrian's Wall.",
  "What kind of monarchy does the UK have?": "Quelle sorte de monarchie le Royaume-Uni a-t-il ?",
  "An absolute monarchy": "Une monarchie absolue",
  "A constitutional monarchy": "Une monarchie constitutionnelle",
  "An elected monarchy": "Une monarchie élective",
  "No monarchy at all": "Pas de monarchie du tout",
  "The monarch is Head of State but does not govern. Parliament makes the law.":
    "Le monarque est chef de l'État mais ne gouverne pas. C'est le Parlement qui fait la loi.",
  "The monarch's power to veto any law": "Le pouvoir du monarque d'opposer son veto à toute loi",
  "The monarch's formal signature that turns a bill into an Act":
    "La signature formelle du monarque qui fait d'un projet une loi",
  "The ceremony crowning a monarch": "La cérémonie du couronnement d'un monarque",
  "The final formal step in making a law. It has not been refused since 1708.":
    "La dernière étape formelle de la fabrication d'une loi. Elle n'a plus été refusée depuis 1708.",
  "Who writes the speech the monarch reads at the State Opening of Parliament?":
    "Qui écrit le discours que le monarque lit au State Opening of Parliament ?",
  "The government": "Le gouvernement",
  "The Speaker of the Commons": "Le Speaker of the Commons",
  "The House of Lords": "La House of Lords",
  "The government writes it — it sets out their plans, not the monarch's views.":
    "C'est le gouvernement qui l'écrit — il y expose ses projets, non les vues du monarque.",
  "Who became monarch in September 2022?": "Qui est devenu monarque en septembre 2022 ?",
  "King Charles III": "King Charles III",
  "Prince William": "Prince William",
  "Queen Camilla": "Queen Camilla",
  "King George VII": "King George VII",
  "Charles III succeeded his mother, Elizabeth II, on her death.":
    "Charles III a succédé à sa mère, Elizabeth II, à sa mort.",
  "Where does a coronation take place?": "Où se déroule un couronnement ?",
  "St Paul's Cathedral": "St Paul's Cathedral",
  "Westminster Abbey": "Westminster Abbey",
  "Buckingham Palace": "Buckingham Palace",
  "Westminster Abbey, conducted by the Archbishop of Canterbury.":
    "Westminster Abbey, la cérémonie étant conduite par l'Archbishop of Canterbury.",
  "Since the law changed in 2013, who inherits the throne?":
    "Depuis le changement de loi de 2013, qui hérite du trône ?",
  "The eldest son": "Le fils aîné",
  "The eldest child, regardless of sex": "L'aîné des enfants, quel que soit son sexe",
  "Whoever Parliament chooses": "Celui que le Parlement choisit",
  "The eldest male relative": "Le parent mâle le plus âgé",
  "The eldest child inherits. An older sister is no longer passed over for a younger brother.":
    "C'est l'aîné des enfants qui hérite. Une sœur aînée n'est plus écartée au profit d'un frère cadet.",
  "Can the monarch express political opinions in public?":
    "Le monarque peut-il exprimer des opinions politiques en public ?",
  "Yes, freely": "Oui, librement",
  "No — the monarch must remain politically neutral":
    "Non — le monarque doit rester politiquement neutre",
  "Only during elections": "Seulement pendant les élections",
  "Only in the House of Lords": "Seulement à la House of Lords",
  "Political neutrality is the whole point of the office. The monarch does not vote either.":
    "La neutralité politique est la raison d'être même de la fonction. Le monarque ne vote pas non plus.",
  "How long did Queen Elizabeth II reign?":
    "Combien de temps la reine Elizabeth II a-t-elle régné ?",
  "50 years": "50 ans",
  "64 years": "64 ans",
  "70 years": "70 ans",
  "75 years": "75 ans",
  "70 years, from 1952 to 2022 — the longest in British history. Victoria's 64 years is second.":
    "70 ans, de 1952 à 2022 — le plus long règne de l'histoire britannique. Les 64 ans de Victoria viennent en deuxième.",
  "Who is the heir to the throne?": "Qui est l'héritier du trône ?",
  "Prince Harry": "Prince Harry",
  "Princess Anne": "Princess Anne",
  "Prince Edward": "Prince Edward",
  "Prince William, Prince of Wales.": "Prince William, Prince of Wales.",
  "What role does the monarch play in appointing a Prime Minister?":
    "Quel rôle le monarque joue-t-il dans la nomination d'un Premier ministre ?",
  "Chooses whoever they prefer": "Il choisit qui bon lui semble",
  "Invites the leader who can command a majority in the Commons":
    "Il appelle le chef capable de réunir une majorité aux Commons",
  "Appoints the leader of the largest party in the Lords":
    "Il nomme le chef du plus grand parti des Lords",
  "Has no role at all": "Il n'y joue aucun rôle",
  "The monarch invites whoever can command a Commons majority — a formal act with no personal choice in practice.":
    "Le monarque appelle celui qui peut réunir une majorité aux Commons — un acte formel, sans choix personnel dans les faits.",
  "How many MPs sit in the House of Commons?": "Combien de MPs siègent à la House of Commons ?",
  "650, one for each constituency, each elected by first past the post.":
    "650, un par circonscription, chacun élu au first past the post.",
  "Elected by constituencies": "Élus par les circonscriptions",
  "Appointed, or sitting as hereditary peers or bishops":
    "Nommés, ou siégeant comme pairs héréditaires ou évêques",
  "Chosen by the House of Commons": "Choisis par la House of Commons",
  "Selected at random": "Tirés au sort",
  "The Lords is not elected. Most are life peers, alongside some hereditary peers and senior Church of England bishops.":
    "La chambre des Lords n'est pas élue. La plupart sont des pairs à vie, aux côtés de quelques pairs héréditaires et des grands évêques de la Church of England.",
  "Five years, though an election can be called sooner.":
    "Cinq ans, même si une élection peut être convoquée plus tôt.",
  "Where does the Prime Minister live and work?":
    "Où le Premier ministre habite-t-il et travaille-t-il ?",
  "10 Downing Street": "10 Downing Street",
  "The Palace of Westminster": "Le Palace of Westminster",
  "Chequers only": "Uniquement à Chequers",
  "10 Downing Street in London.": "Au 10 Downing Street, à Londres.",
  "What voting system is used to elect MPs to the House of Commons?":
    "Quel mode de scrutin sert à élire les MPs de la House of Commons ?",
  "Proportional representation": "La représentation proportionnelle",
  "First past the post": "Le first past the post",
  "The single transferable vote": "Le vote unique transférable",
  "A second ballot": "Un second tour",
  "First past the post — whoever gets the most votes in a constituency wins the seat.":
    "Le first past the post — celui qui obtient le plus de voix dans une circonscription emporte le siège.",
  "What is a by-election?": "Qu'est-ce qu'une by-election ?",
  "A second round of a general election": "Un second tour d'une élection générale",
  "An election in one constituency when its MP dies or resigns":
    "Une élection dans une seule circonscription quand son MP meurt ou démissionne",
  "An election for the House of Lords": "Une élection pour la House of Lords",
  "A local council election": "Une élection au conseil local",
  "It fills a single seat between general elections.":
    "Elle pourvoit un siège unique entre deux élections générales.",
  "Who chairs debates in the House of Commons?": "Qui préside les débats à la House of Commons ?",
  "The Leader of the Opposition": "Le Leader of the Opposition",
  "The Lord Chancellor": "Le Lord Chancellor",
  "The Speaker, who is politically neutral and gives up party allegiance.":
    "Le Speaker, qui est politiquement neutre et renonce à toute appartenance de parti.",
  "From what age can you vote in a UK general election?":
    "À partir de quel âge peut-on voter à une élection générale au Royaume-Uni ?",
  "17": "17",
  "18, and you must be on the electoral register. Photo ID is now required at polling stations in Great Britain.":
    "18 ans, et il faut être inscrit sur l'electoral register. Une pièce d'identité avec photo est désormais exigée dans les bureaux de vote en Grande-Bretagne.",
  "What is the Cabinet?": "Qu'est-ce que le Cabinet ?",
  "All MPs of the governing party": "L'ensemble des MPs du parti au pouvoir",
  "About 20 senior ministers chosen by the Prime Minister":
    "Une vingtaine de ministres importants choisis par le Premier ministre",
  "The House of Lords committee": "La commission de la House of Lords",
  "The civil service leadership": "La direction de la fonction publique",
  "Senior ministers, each running a department — Chancellor of the Exchequer, Home Secretary, Foreign Secretary and so on.":
    "Les ministres importants, chacun à la tête d'un ministère — Chancellor of the Exchequer, Home Secretary, Foreign Secretary et ainsi de suite.",
  "What is the Opposition?": "Qu'est-ce que l'Opposition ?",
  "Members of the Lords who vote against the government":
    "Les membres des Lords qui votent contre le gouvernement",
  "The largest party not in government": "Le plus grand parti qui n'est pas au gouvernement",
  "Any MP who rebels": "Tout MP qui se rebelle",
  "The civil service": "La fonction publique",
  "Its leader is Leader of the Opposition and heads a shadow cabinet challenging each minister.":
    "Son chef est le Leader of the Opposition et dirige un cabinet fantôme qui fait face à chaque ministre.",
  "Are civil servants politically neutral?": "Les fonctionnaires sont-ils politiquement neutres ?",
  "No — they change with each government": "Non — ils changent à chaque gouvernement",
  "Yes — they carry out policy but stay in post when the government changes":
    "Oui — ils appliquent la politique mais restent en poste quand le gouvernement change",
  "Only senior ones": "Seulement les plus haut placés",
  "They are elected": "Ils sont élus",
  "Ministers come and go; the civil service stays and serves whichever government is in office.":
    "Les ministres passent ; la fonction publique reste et sert le gouvernement en place, quel qu'il soit.",
  "What are local council services funded by?":
    "Par quoi les services du conseil local sont-ils financés ?",
  "National Insurance": "La National Insurance",
  "Council tax and central government funding": "La council tax et les dotations de l'État",
  "Income tax only": "Le seul impôt sur le revenu",
  "The Crown": "La Couronne",
  "Councils run schools, refuse collection, housing, roads and libraries, funded by council tax and central grants.":
    "Les conseils gèrent les écoles, le ramassage des ordures, le logement, les routes et les bibliothèques, financés par la council tax et les dotations de l'État.",
  "What must happen before a bill becomes an Act of Parliament?":
    "Que faut-il avant qu'un projet devienne un Act of Parliament ?",
  "Only a Commons vote": "Un vote des Commons, et rien d'autre",
  "Debate and agreement in both Houses, then Royal Assent":
    "Un débat et un accord dans les deux chambres, puis le Royal Assent",
  "A public referendum": "Un référendum",
  "Approval by the Supreme Court": "L'approbation de la Supreme Court",
  "Commons, then Lords, back to the Commons if amended, then the monarch's Royal Assent.":
    "Les Commons, puis les Lords, retour aux Commons en cas d'amendement, puis le Royal Assent du monarque.",
  "Which of these is a national party in Scotland?":
    "Lequel de ces partis est un parti national en Écosse ?",
  "Plaid Cymru": "Plaid Cymru",
  "The SNP": "Le SNP",
  "Sinn Féin": "Le Sinn Féin",
  "The Liberal Democrats": "Les Liberal Democrats",
  "The Scottish National Party. Plaid Cymru is the Welsh national party.":
    "Le Scottish National Party. Plaid Cymru est le parti national gallois.",
  "MSPs in Scotland, MSs in the Senedd, MLAs in the Northern Ireland Assembly, MPs at Westminster.":
    "Des MSPs en Écosse, des MSs au Senedd, des MLAs à la Northern Ireland Assembly, des MPs à Westminster.",
  "What are members of the Northern Ireland Assembly called?":
    "Comment appelle-t-on les membres de la Northern Ireland Assembly ?",
  "TDs": "Des TDs",
  "MLAs — Members of the Legislative Assembly, at Stormont.":
    "Des MLAs — Members of the Legislative Assembly, à Stormont.",
  "Which of these is a reserved matter kept by the UK Parliament?":
    "Lequel de ces domaines est réservé au Parlement du Royaume-Uni ?",
  "Defence, foreign policy, immigration, the currency and national security are reserved. Health, education and housing are devolved.":
    "La défense, la politique étrangère, l'immigration, la monnaie et la sécurité nationale sont réservées. La santé, l'éducation et le logement sont dévolus.",
  "Where does the Scottish Parliament sit?": "Où siège le Parlement écossais ?",
  "Stormont": "Stormont",
  "Holyrood": "Holyrood",
  "The Senedd": "Le Senedd",
  "Westminster": "Westminster",
  "Holyrood in Edinburgh. Stormont is Northern Ireland's, the Senedd is Wales'.":
    "Holyrood, à Edinburgh. Stormont est celui de l'Irlande du Nord, le Senedd celui du pays de Galles.",
  "What is the Welsh Parliament called?": "Comment s'appelle le Parlement gallois ?",
  "The Assembly": "The Assembly",
  "Senedd Cymru. It was called the National Assembly for Wales until 2020.":
    "Senedd Cymru. Il s'appelait National Assembly for Wales jusqu'en 2020.",
  "Does England have its own devolved parliament?":
    "L'Angleterre a-t-elle son propre parlement dévolu ?",
  "Yes, in Manchester": "Oui, à Manchester",
  "Yes, alongside the UK Parliament": "Oui, à côté du Parlement du Royaume-Uni",
  "No — English matters are decided by the UK Parliament":
    "Non — les affaires anglaises sont tranchées par le Parlement du Royaume-Uni",
  "Yes, since 1999": "Oui, depuis 1999",
  "England has no devolved parliament, which is why the UK Parliament and 'the English one' are easy to confuse.":
    "L'Angleterre n'a pas de parlement dévolu, et c'est pourquoi l'on confond si facilement le Parlement du Royaume-Uni et 'celui des Anglais'.",
  "Which agreement created the Northern Ireland Assembly?":
    "Quel accord a créé la Northern Ireland Assembly ?",
  "The Good Friday Agreement of 1998": "Le Good Friday Agreement de 1998",
  "The Scotland Act": "Le Scotland Act",
  "The Good Friday Agreement, with power shared between communities.":
    "Le Good Friday Agreement, avec un pouvoir partagé entre les communautés.",
  "Why do university fees and NHS rules differ across the UK?":
    "Pourquoi les frais universitaires et les règles du NHS varient-ils d'une nation à l'autre ?",
  "Each nation sets its own taxes entirely": "Chaque nation fixe entièrement ses propres impôts",
  "Health and education are devolved matters": "La santé et l'éducation sont des domaines dévolus",
  "The EU required it": "L'Union européenne l'exigeait",
  "Local councils decide": "Ce sont les conseils locaux qui décident",
  "Health and education are devolved, so each nation's government sets its own policy.":
    "La santé et l'éducation sont dévolues, et le gouvernement de chaque nation fixe donc sa propre politique.",
  "How many people sit on a jury in Scotland?":
    "Combien de personnes siègent dans un jury en Écosse ?",
  "15 — Scotland has its own legal system and differs from the rest of the UK here.":
    "Quinze — l'Écosse a son propre système juridique et se distingue ici du reste du Royaume-Uni.",
  "Crown Court judges with a jury": "Les juges de la Crown Court avec un jury",
  "Magistrates, usually unpaid volunteers":
    "Les magistrates, le plus souvent des bénévoles non rémunérés",
  "Barristers sitting as a panel": "Des barristers siégeant en collège",
  "Magistrates handle the great majority of criminal cases and are members of the local community.":
    "Les magistrates traitent la grande majorité des affaires pénales et sont des habitants de la commune.",
  "Theft": "Le vol",
  "Civil law covers disputes between people and organisations. The other three are criminal offences.":
    "Le droit civil couvre les litiges entre personnes et organisations. Les trois autres sont des infractions pénales.",
  "What is the highest court of appeal in the UK?":
    "Quelle est la plus haute juridiction d'appel du Royaume-Uni ?",
  "The Crown Court": "La Crown Court",
  "The Court of Appeal": "La Court of Appeal",
  "The Supreme Court, which took over that role from the House of Lords in 2009.":
    "La Supreme Court, qui a repris ce rôle à la House of Lords en 2009.",
  "Between which ages can you be summoned for jury service?":
    "Entre quels âges peut-on être convoqué au jury service ?",
  "16 to 65": "De 16 à 65 ans",
  "18 to 70": "De 18 à 70 ans",
  "21 to 70": "De 21 à 70 ans",
  "18 to 65": "De 18 à 65 ans",
  "18 to 70, if you are on the electoral register. It is a legal duty.":
    "De 18 à 70 ans, si l'on est inscrit sur l'electoral register. C'est une obligation légale.",
  "What is legal aid?": "Qu'est-ce que le legal aid ?",
  "Free advice from the police": "Des conseils gratuits donnés par la police",
  "Public funding for legal advice or representation for those who cannot afford it":
    "Un financement public du conseil ou de la représentation juridique pour ceux qui n'en ont pas les moyens",
  "A charity run by solicitors": "Une œuvre de bienfaisance tenue par des solicitors",
  "Insurance against losing a case": "Une assurance contre la perte d'un procès",
  "It exists so the right to a fair trial is real rather than theoretical.":
    "Il existe pour que le droit à un procès équitable soit réel et non théorique.",
  "What is the difference between a solicitor and a barrister?":
    "Quelle est la différence entre un solicitor et un barrister ?",
  "Solicitors advise and prepare cases; barristers argue in the higher courts":
    "Les solicitors conseillent et préparent les dossiers ; les barristers plaident devant les juridictions supérieures",
  "Barristers advise; solicitors judge": "Les barristers conseillent ; les solicitors jugent",
  "There is no difference": "Il n'y a aucune différence",
  "Solicitors work only for the government": "Les solicitors ne travaillent que pour l'État",
  "Solicitors give advice and represent clients in lower courts; barristers are specialist advocates in the higher courts.":
    "Les solicitors conseillent et représentent leurs clients devant les juridictions inférieures ; les barristers sont des plaideurs spécialisés devant les juridictions supérieures.",
  "Who decides the sentence in a Crown Court trial?":
    "Qui décide de la peine dans un procès en Crown Court ?",
  "The jury": "Le jury",
  "The judge": "Le juge",
  "The magistrates": "Les magistrates",
  "The prosecution": "L'accusation",
  "The jury decides guilt; the judge decides the law and the sentence.":
    "Le jury décide de la culpabilité ; le juge dit le droit et fixe la peine.",
  "Are judges independent of the government?": "Les juges sont-ils indépendants du gouvernement ?",
  "No, they are appointed by ministers and follow their instructions":
    "Non, ils sont nommés par les ministres et suivent leurs instructions",
  "Yes — they interpret the law and can find government action unlawful":
    "Oui — ils interprètent la loi et peuvent juger illégal un acte du gouvernement",
  "Only in the Supreme Court": "Seulement à la Supreme Court",
  "Only in civil cases": "Seulement dans les affaires civiles",
  "Judicial independence is central to the rule of law. A government act found unlawful must be put right.":
    "L'indépendance des juges est au cœur de l'État de droit. Un acte du gouvernement jugé illégal doit être corrigé.",
  "What is the age of criminal responsibility in Scotland?":
    "Quel est l'âge de la responsabilité pénale en Écosse ?",
  "12 in Scotland and 10 in England, Wales and Northern Ireland — a difference the test likes to ask about.":
    "12 ans en Écosse et 10 ans en Angleterre, au pays de Galles et en Irlande du Nord — une différence sur laquelle l'examen aime interroger.",
  "Must the police obey the law themselves?": "La police doit-elle elle-même obéir à la loi ?",
  "No, they are exempt while on duty": "Non, elle en est dispensée en service",
  "Yes — and complaints against them are investigated independently":
    "Oui — et les plaintes contre elle font l'objet d'une enquête indépendante",
  "Only senior officers": "Seulement les officiers supérieurs",
  "Only in civil matters": "Seulement en matière civile",
  "Everyone is subject to the law, including the police. That is what the rule of law means.":
    "Tout le monde est soumis à la loi, la police comprise. C'est cela, l'État de droit.",
  "Local council services": "Les services du conseil local",
  "NI contributions build entitlement to the state pension and some benefits. Council tax pays for local services.":
    "Les cotisations de National Insurance ouvrent des droits à la pension d'État et à certaines prestations. La council tax paie les services locaux.",
  "How do most employees pay income tax?":
    "Comment la plupart des salariés paient-ils l'impôt sur le revenu ?",
  "By annual cheque": "Par chèque annuel",
  "Through PAYE, deducted by the employer": "Par le PAYE, prélevé par l'employeur",
  "Through Self Assessment": "Par le Self Assessment",
  "At their local council": "Auprès de leur conseil local",
  "PAYE — Pay As You Earn. The self-employed complete a Self Assessment return instead.":
    "Le PAYE — Pay As You Earn. Les indépendants remplissent à la place une déclaration de Self Assessment.",
  "Which body collects tax in the UK?": "Quel organisme perçoit l'impôt au Royaume-Uni ?",
  "The Treasury": "Le Treasury",
  "HM Revenue and Customs": "HM Revenue and Customs",
  "The Bank of England": "La Bank of England",
  "The Home Office": "Le Home Office",
  "HMRC collects income tax, National Insurance and other taxes.":
    "HMRC perçoit l'impôt sur le revenu, la National Insurance et les autres impôts.",
  "Which Act brought the European Convention on Human Rights into UK law?":
    "Quelle loi a intégré la Convention européenne des droits de l'homme au droit britannique ?",
  "The Human Rights Act 1998.": "Le Human Rights Act 1998.",
  "Which of these is a responsibility of living in the UK?":
    "Lequel de ces éléments est un devoir quand on vit au Royaume-Uni ?",
  "Joining a political party": "Adhérer à un parti politique",
  "Paying tax and National Insurance": "Payer l'impôt et la National Insurance",
  "Attending church": "Aller à l'église",
  "Owning property": "Posséder un bien",
  "Tax and National Insurance fund the NHS, schools, roads, defence and the police.":
    "L'impôt et la National Insurance financent le NHS, les écoles, les routes, la défense et la police.",
  "How is a vote cast in a UK election?": "Comment vote-t-on lors d'une élection au Royaume-Uni ?",
  "Publicly, by show of hands": "Publiquement, à main levée",
  "By secret ballot": "À bulletin secret",
  "By declaring it to a returning officer": "En le déclarant à un returning officer",
  "Online only": "En ligne uniquement",
  "By secret ballot — your vote cannot be seen or traced.":
    "À bulletin secret — personne ne peut voir votre vote ni le remonter jusqu'à vous.",
  "What should you do about a law you disagree with?":
    "Que faire face à une loi que l'on désapprouve ?",
  "Ignore it": "L'ignorer",
  "Campaign and vote to change it, while still obeying it":
    "Faire campagne et voter pour la changer, tout en continuant de la respecter",
  "Take it to the monarch": "En saisir le monarque",
  "Refuse to pay tax": "Refuser de payer l'impôt",
  "Obey the law while working to change it. That is the difference between liberty and lawlessness.":
    "Respecter la loi tout en œuvrant à la changer. C'est là toute la différence entre la liberté et le désordre.",
  "Allowed with parental consent": "Autorisé avec le consentement des parents",
  "A criminal offence": "Une infraction pénale",
  "Allowed over 21": "Autorisé au-delà de 21 ans",
  "A civil matter only": "Une affaire purement civile",
  "Forcing someone to marry is a crime. An arranged marriage both people freely accept is lawful; a forced one is not.":
    "Forcer quelqu'un à se marier est un délit. Un mariage arrangé que les deux acceptent librement est licite ; un mariage forcé ne l'est pas.",
  "What is a civil partnership?": "Qu'est-ce qu'un civil partnership ?",
  "A business agreement": "Un accord d'affaires",
  "A legal alternative to marriage with similar rights":
    "Une solution légale à côté du mariage, avec des droits voisins",
  "A form of employment contract": "Une forme de contrat de travail",
  "A council housing arrangement": "Un arrangement de logement social",
  "Open to both same-sex and opposite-sex couples, with rights similar to marriage.":
    "Ouvert aux couples de même sexe comme de sexe différent, avec des droits voisins de ceux du mariage.",
  "When did same-sex marriage become legal in Northern Ireland?":
    "Quand le mariage entre personnes de même sexe est-il devenu légal en Irlande du Nord ?",
  "2014": "2014",
  "It is not legal there": "Il n'y est pas légal",
  "2020 in Northern Ireland; 2014 in England, Wales and Scotland.":
    "En 2020 en Irlande du Nord ; en 2014 en Angleterre, au pays de Galles et en Écosse.",
  "How is volunteering regarded in the UK?": "Comment le bénévolat est-il vu au Royaume-Uni ?",
  "As unusual and discouraged": "Comme rare et mal vu",
  "As a valued part of community life": "Comme une part appréciée de la vie de la commune",
  "As paid part-time work": "Comme un travail rémunéré à temps partiel",
  "As compulsory for citizens": "Comme obligatoire pour les citoyens",
  "Charity shops, food banks, sports clubs, school governors — giving time is treated as valuable as giving money.":
    "Boutiques caritatives, banques alimentaires, clubs sportifs, conseils d'école — donner de son temps y vaut autant que donner de l'argent.",
  "Roughly what share of the UK population belongs to a minority ethnic group?":
    "Quelle part environ de la population du Royaume-Uni appartient à une minorité ethnique ?",
  "About a fifth": "Environ un cinquième",
  "About a half": "Environ la moitié",
  "About three quarters": "Environ trois quarts",
  "Roughly a fifth, with the largest cities being the most diverse.":
    "Environ un cinquième, les plus grandes villes étant les plus mêlées.",
  "The monarch — a role dating from Henry VIII's break with Rome. The Archbishop of Canterbury is its senior bishop.":
    "Le monarque — un rôle né de la rupture de Henry VIII avec Rome. L'Archbishop of Canterbury en est le premier évêque.",
  "Which nation of the UK has a Presbyterian national church?":
    "Quelle nation du Royaume-Uni a une Église nationale presbytérienne ?",
  "The Church of Scotland. Wales and Northern Ireland have no established church at all.":
    "La Church of Scotland. Le pays de Galles et l'Irlande du Nord n'ont aucune Église établie.",
  "What is the second largest religion in the UK?":
    "Quelle est la deuxième religion du Royaume-Uni par le nombre ?",
  "Islam. Christianity is the largest, and a large and growing share of people report no religion.":
    "L'islam. Le christianisme est la première, et une part importante et croissante des gens se déclare sans religion.",
  "Which festival is known as the festival of lights?":
    "Quelle fête est connue comme la fête des lumières ?",
  "Eid al-Fitr": "L'Aïd el-Fitr",
  "Diwali": "Diwali",
  "Vaisakhi": "Vaisakhi",
  "Hanukkah": "Hanoucca",
  "Diwali, the Hindu festival of lights, also marked by Sikhs and Jains.":
    "Diwali, la fête hindoue des lumières, célébrée aussi par les sikhs et les jaïns.",
  "Who founded Sikhism?": "Qui a fondé le sikhisme ?",
  "Guru Nanak": "Guru Nanak",
  "The Buddha": "Le Bouddha",
  "Guru Gobind Singh": "Guru Gobind Singh",
  "Moses": "Moïse",
  "Guru Nanak. Vaisakhi is the major Sikh festival.":
    "Guru Nanak. Vaisakhi est la grande fête sikhe.",
  "Does religious tolerance in the UK protect people with no religion?":
    "La tolérance religieuse au Royaume-Uni protège-t-elle les personnes sans religion ?",
  "No, only believers": "Non, seulement les croyants",
  "Yes — belief and non-belief are both protected":
    "Oui — la croyance et l'absence de croyance sont protégées toutes deux",
  "Only in Scotland": "Seulement en Écosse",
  "Only in schools": "Seulement à l'école",
  "Religion or belief is a protected characteristic, and that includes having none.":
    "La religion ou les convictions sont un critère protégé, et cela comprend le fait de n'en avoir aucune.",
  "Which senior clergy sit in the House of Lords?":
    "Quels dignitaires religieux siègent à la House of Lords ?",
  "Roman Catholic bishops": "Les évêques catholiques romains",
  "Church of England bishops": "Les évêques de la Church of England",
  "Church of Scotland ministers": "Les pasteurs de la Church of Scotland",
  "No clergy sit in the Lords": "Aucun religieux ne siège aux Lords",
  "Senior Church of England bishops sit in the Lords — a consequence of it being the established church in England.":
    "Les grands évêques de la Church of England siègent aux Lords — conséquence de son statut d'Église établie en Angleterre.",
  "What is celebrated on 26 December?": "Que fête-t-on le 26 décembre ?",
  "Christmas Eve": "La veille de Noël",
  "Boxing Day": "Boxing Day",
  "New Year's Eve": "La Saint-Sylvestre",
  "Twelfth Night": "Twelfth Night",
  "Boxing Day, a public holiday throughout the UK.":
    "Boxing Day, jour férié dans tout le Royaume-Uni.",
  "A Northern Irish holiday in July": "Une fête nord-irlandaise de juillet",
  "New Year's Eve in Scotland, celebrated on a larger scale than elsewhere. Scotland also takes 2 January as a holiday.":
    "La Saint-Sylvestre en Écosse, fêtée plus largement qu'ailleurs. L'Écosse chôme aussi le 2 janvier.",
  "What is eaten on Shrove Tuesday?": "Que mange-t-on le Shrove Tuesday ?",
  "Hot cross buns": "Des hot cross buns",
  "Pancakes": "Des crêpes",
  "Christmas pudding": "Du christmas pudding",
  "Haggis": "Du haggis",
  "Pancake Day, the day before Lent begins. It is not a public holiday.":
    "Le Pancake Day, la veille du début du carême. Ce n'est pas un jour férié.",
  "What does Remembrance Day on 11 November mark?":
    "Que marque le Remembrance Day du 11 novembre ?",
  "The Gunpowder Plot": "Le Gunpowder Plot",
  "The Battle of Britain": "La Battle of Britain",
  "The armistice of 11 November 1918. Poppies are worn and there is a two-minute silence at 11am.":
    "L'armistice du 11 novembre 1918. On porte un coquelicot et l'on observe deux minutes de silence à onze heures.",
  "Which two patron saints' days are public holidays in their nations?":
    "Quelles deux fêtes de saints patrons sont fériées dans leur nation ?",
  "St George's and St David's": "Celles de St George et de St David",
  "St Patrick's and St Andrew's": "Celles de St Patrick et de St Andrew",
  "St George's and St Andrew's": "Celles de St George et de St Andrew",
  "All four are public holidays": "Les quatre sont fériées",
  "St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland. St George's and St David's are not.":
    "La St Patrick's Day en Irlande du Nord et la St Andrew's Day en Écosse. Celles de St George et de St David ne le sont pas.",
  "What are bank holidays?": "Que sont les bank holidays ?",
  "Days when only banks close": "Des jours où seules les banques ferment",
  "Public holidays when most businesses close":
    "Des jours fériés où la plupart des entreprises ferment",
  "Days for paying taxes": "Des jours consacrés au paiement des impôts",
  "Religious festivals only": "Des fêtes religieuses, et rien d'autre",
  "They differ between the four nations, and include days in early May, late May and August.":
    "Ils diffèrent d'une nation à l'autre et comprennent des jours début mai, fin mai et en août.",
  "When is Burns Night?": "Quand tombe la Burns Night ?",
  "1 January": "Le 1er janvier",
  "25 January": "Le 25 janvier",
  "25 January, celebrating Robert Burns, Scotland's national poet.":
    "Le 25 janvier, en l'honneur de Robert Burns, le poète national de l'Écosse.",
  "On what date is Halloween?": "À quelle date tombe Halloween ?",
  "31 October": "Le 31 octobre",
  "5 November": "Le 5 novembre",
  "1 November": "Le 1er novembre",
  "11 November": "Le 11 novembre",
  "31 October — an ancient festival, now marked with costumes and pumpkins. Bonfire Night follows on 5 November.":
    "Le 31 octobre — une fête ancienne, marquée aujourd'hui par des déguisements et des citrouilles. La Bonfire Night suit le 5 novembre.",
  "Which Easter days are public holidays in most of the UK?":
    "Quels jours de Pâques sont fériés dans la plus grande partie du Royaume-Uni ?",
  "Good Friday and Easter Monday": "Le Good Friday et le lundi de Pâques",
  "Easter Sunday only": "Le dimanche de Pâques seulement",
  "The whole Easter week": "Toute la semaine de Pâques",
  "Maundy Thursday only": "Le jeudi saint seulement",
  "Good Friday and Easter Monday. The date moves each year, falling in March or April.":
    "Le Good Friday et le lundi de Pâques. La date change chaque année et tombe en mars ou en avril.",
  "What is traditionally eaten for Christmas dinner in Britain?":
    "Que mange-t-on traditionnellement au repas de Noël en Grande-Bretagne ?",
  "Roast turkey": "De la dinde rôtie",
  "Fish and chips": "Du fish and chips",
  "Roast lamb": "De l'agneau rôti",
  "Roast turkey with vegetables, followed by Christmas pudding.":
    "De la dinde rôtie avec des légumes, suivie du christmas pudding.",
  "Wimbledon is a district of south-west London — the oldest tennis tournament in the world.":
    "Wimbledon est un quartier du sud-ouest de Londres — c'est le plus ancien tournoi de tennis du monde.",
  "Golf, with St Andrews as its historic home. Cricket and rugby originated in England.":
    "Le golf, dont St Andrews est le berceau historique. Le cricket et le rugby sont nés en Angleterre.",
  "What is the Ashes?": "Qu'est-ce que les Ashes ?",
  "A rugby tournament": "Un tournoi de rugby",
  "A Test cricket series between England and Australia":
    "Une série de Test de cricket entre l'Angleterre et l'Australie",
  "A horse race at Aintree": "Une course hippique à Aintree",
  "A golf championship": "Un championnat de golf",
  "The historic cricket series between England and Australia. Lord's in London is the most famous ground.":
    "La série historique de cricket entre l'Angleterre et l'Australie. Lord's, à Londres, en est le terrain le plus célèbre.",
  "Which nations compete in the Six Nations rugby championship?":
    "Quelles nations disputent le tournoi de rugby des Six Nations ?",
  "Only the four UK nations": "Les quatre nations du Royaume-Uni seulement",
  "England, Scotland, Wales, Ireland, France and Italy":
    "L'Angleterre, l'Écosse, le pays de Galles, l'Irlande, la France et l'Italie",
  "The Commonwealth nations": "Les nations du Commonwealth",
  "England, Wales, Australia, France, Italy and Ireland":
    "L'Angleterre, le pays de Galles, l'Australie, la France, l'Italie et l'Irlande",
  "The four home nations plus France and Italy — and Ireland competes as one team, north and south.":
    "Les quatre nations britanniques plus la France et l'Italie — et l'Irlande joue en une seule équipe, nord et sud réunis.",
  "Where is the Grand National run?": "Où se court le Grand National ?",
  "Ascot": "Ascot",
  "Aintree": "Aintree",
  "Epsom": "Epsom",
  "Cheltenham": "Cheltenham",
  "Aintree, near Liverpool. Royal Ascot and the Derby at Epsom are the other famous meetings.":
    "Aintree, près de Liverpool. Royal Ascot et le Derby d'Epsom sont les autres grandes réunions.",
  "How do the UK nations compete at the Commonwealth Games?":
    "Comment les nations du Royaume-Uni concourent-elles aux Commonwealth Games ?",
  "As one British team": "En une seule équipe britannique",
  "Each nation competes separately": "Chaque nation concourt séparément",
  "Only England competes": "Seule l'Angleterre concourt",
  "As two teams, Britain and Ireland": "En deux équipes, la Grande-Bretagne et l'Irlande",
  "England, Scotland, Wales and Northern Ireland each enter separately — unlike at the Olympics.":
    "L'Angleterre, l'Écosse, le pays de Galles et l'Irlande du Nord s'engagent chacune de son côté — au contraire des Jeux olympiques.",
  "What is the oldest football competition in the world?":
    "Quelle est la plus ancienne compétition de football au monde ?",
  "The Premier League": "La Premier League",
  "The FA Cup": "La FA Cup",
  "The World Cup": "La Coupe du monde",
  "The Champions League": "La Champions League",
  "The FA Cup, an English competition and the oldest in the sport.":
    "La FA Cup, une compétition anglaise et la plus ancienne de ce sport.",
  "Which organisation cares for many historic houses, gardens and coastline in the UK?":
    "Quelle organisation veille sur de nombreuses demeures historiques, jardins et portions de littoral au Royaume-Uni ?",
  "The National Trust": "Le National Trust",
  "English Heritage only": "English Heritage seulement",
  "The National Trust, a charity that protects historic places and open countryside.":
    "Le National Trust, une association qui protège les lieux historiques et la campagne ouverte.",
  "Chaucer, in the fourteenth century — two hundred years before Shakespeare.":
    "Chaucer, au quatorzième siècle — deux cents ans avant Shakespeare.",
  "Liverpool — the most commercially successful band in British history.":
    "Liverpool — le groupe au plus grand succès commercial de l'histoire britannique.",
  "Scotland's Bard. He wrote Auld Lang Syne, sung at New Year around the world.":
    "Le barde de l'Écosse. Il a écrit Auld Lang Syne, que l'on chante au Nouvel An dans le monde entier.",
  "Who wrote Pride and Prejudice?": "Qui a écrit Pride and Prejudice ?",
  "Charlotte Brontë": "Charlotte Brontë",
  "George Eliot": "George Eliot",
  "Agatha Christie": "Agatha Christie",
  "Jane Austen, whose novels portray English social life in the early nineteenth century.":
    "Jane Austen, dont les romans peignent la vie sociale anglaise du début du dix-neuvième siècle.",
  "Which novelist wrote Oliver Twist and Great Expectations?":
    "Quel romancier a écrit Oliver Twist et Great Expectations ?",
  "Thomas Hardy": "Thomas Hardy",
  "Rudyard Kipling": "Rudyard Kipling",
  "George Orwell": "George Orwell",
  "Charles Dickens, whose books exposed the poverty of industrial Britain.":
    "Charles Dickens, dont les livres ont mis au jour la misère de la Grande-Bretagne industrielle.",
  "Where is the National Gallery?": "Où se trouve la National Gallery ?",
  "Trafalgar Square, London": "Trafalgar Square, à Londres",
  "Trafalgar Square in London. It holds the national collection of paintings and is free to enter.":
    "À Trafalgar Square, à Londres. Elle abrite la collection nationale de peinture et l'entrée y est libre.",
  "In which year was the British Museum founded?":
    "En quelle année le British Museum a-t-il été fondé ?",
  "1653": "1653",
  "1753": "1753",
  "1853": "1853",
  "1901": "1901",
  "1753 — the first national public museum in the world, and free to enter.":
    "1753 — le premier musée public national au monde, et l'entrée y est libre.",
  "Which prize for contemporary art is named after a British painter?":
    "Quel prix d'art contemporain porte le nom d'un peintre britannique ?",
  "The Booker Prize": "Le Booker Prize",
  "The Turner Prize": "Le Turner Prize",
  "The Mercury Prize": "Le Mercury Prize",
  "The Brit Award": "Le Brit Award",
  "The Turner Prize, named after J. M. W. Turner, the painter of light and sea.":
    "Le Turner Prize, du nom de J. M. W. Turner, le peintre de la lumière et de la mer.",
  "What are the Proms?": "Que sont les Proms ?",
  "A summer season of classical concerts at the Royal Albert Hall":
    "Une saison estivale de concerts classiques au Royal Albert Hall",
  "A rock festival in Somerset": "Un festival de rock dans le Somerset",
  "A poetry competition": "Un concours de poésie",
  "A dance tradition in Wales": "Une tradition de danse au pays de Galles",
  "Running since 1895 and ending with the Last Night of the Proms.":
    "Elles ont lieu depuis 1895 et se terminent par la Last Night of the Proms.",
  "Which of these composers was British?": "Lequel de ces compositeurs était britannique ?",
  "Edward Elgar": "Edward Elgar",
  "Johann Sebastian Bach": "Johann Sebastian Bach",
  "Wolfgang Amadeus Mozart": "Wolfgang Amadeus Mozart",
  "Antonín Dvořák": "Antonín Dvořák",
  "Elgar, alongside Purcell, Holst, Vaughan Williams and Britten.":
    "Elgar, aux côtés de Purcell, Holst, Vaughan Williams et Britten.",
  "Fleming, a Scottish scientist, in 1928. It became the first widely used antibiotic.":
    "Fleming, un savant écossais, en 1928. Ce fut le premier antibiotique d'usage courant.",
  "Tim Berners-Lee, in 1989 while working at CERN.":
    "Tim Berners-Lee, en 1989, alors qu'il travaillait au CERN.",
  "Which scientist described gravity and the laws of motion?":
    "Quel savant a décrit la gravité et les lois du mouvement ?",
  "Newton, whose Principia Mathematica is one of the most important scientific books ever written.":
    "Newton, dont les Principia Mathematica sont l'un des livres scientifiques les plus importants jamais écrits.",
  "Who gave the first public demonstration of television?":
    "Qui a fait la première démonstration publique de la télévision ?",
  "John Logie Baird, a Scot. Bell developed the telephone.":
    "John Logie Baird, un Écossais. Bell, lui, a mis au point le téléphone.",
  "Whose X-ray work was essential to discovering the structure of DNA?":
    "Les travaux aux rayons X de qui furent décisifs pour découvrir la structure de l'ADN ?",
  "Ada Lovelace": "Ada Lovelace",
  "Dorothy Hodgkin": "Dorothy Hodgkin",
  "Rosalind Franklin, alongside Crick and Watson.":
    "Rosalind Franklin, aux côtés de Crick et Watson.",
  "Who discovered electromagnetic induction, the principle behind the electric motor?":
    "Qui a découvert l'induction électromagnétique, le principe qui fait tourner le moteur électrique ?",
  "Michael Faraday — the principle behind both the motor and the generator.":
    "Michael Faraday — c'est le principe du moteur comme de la génératrice.",
  "Where was Dolly the sheep, the first cloned mammal, created?":
    "Où la brebis Dolly, premier mammifère cloné, a-t-elle été créée ?",
  "Scotland, in 1996.": "En Écosse, en 1996.",
  "In which country did the first successful IVF birth take place?":
    "Dans quel pays a eu lieu la première naissance réussie par fécondation in vitro ?",
  "The United States": "Les États-Unis",
  "France": "La France",
  "Australia": "L'Australie",
  "England, in 1978.": "En Angleterre, en 1978.",
  "Who laid the foundations of computer science and worked at Bletchley Park?":
    "Qui a posé les bases de l'informatique et travaillé à Bletchley Park ?",
  "Alan Turing, whose codebreaking work shortened the Second World War.":
    "Alan Turing, dont le travail de décryptage a raccourci la Seconde Guerre mondiale.",
  "Margaret Thatcher, from 1979 to 1990. Theresa May was the second, from 2016.":
    "Margaret Thatcher, de 1979 à 1990. Theresa May fut la deuxième, à partir de 2016.",
  "Which Prime Minister's government built the welfare state and the NHS?":
    "Le gouvernement de quel Premier ministre a bâti l'État-providence et le NHS ?",
  "Attlee's government, elected in 1945. Bevan founded the NHS as his Health Minister.":
    "Le gouvernement d'Attlee, élu en 1945. Bevan a fondé le NHS comme son ministre de la Santé.",
  "Who opened Britain's first Indian restaurant and introduced shampooing?":
    "Qui a ouvert le premier restaurant indien de Grande-Bretagne et introduit le shampooing ?",
  "Gandhi": "Gandhi",
  "Sake Dean Mahomet, an early figure in Britain's multicultural history.":
    "Sake Dean Mahomet, une figure des débuts de l'histoire multiculturelle britannique.",
  "Which explorer's voyages mapped much of the Pacific?":
    "Les voyages de quel explorateur ont cartographié une grande partie du Pacifique ?",
  "Captain James Cook": "Captain James Cook",
  "Sir Walter Raleigh": "Sir Walter Raleigh",
  "Ernest Shackleton": "Ernest Shackleton",
  "Captain James Cook, in the eighteenth century.": "Captain James Cook, au dix-huitième siècle.",
  "Who was voted the greatest Briton in a national poll?":
    "Qui a été élu le plus grand Britannique lors d'un sondage national ?",
  "Winston Churchill, who led Britain through the Second World War.":
    "Winston Churchill, qui a mené la Grande-Bretagne à travers la Seconde Guerre mondiale.",
  "Who led Scottish resistance to Edward I and was executed in 1305?":
    "Qui a mené la résistance écossaise à Edward I et a été exécuté en 1305 ?",
  "Rob Roy": "Rob Roy",
  "William Wallace. Robert the Bruce later won independence at Bannockburn in 1314.":
    "William Wallace. Robert the Bruce a plus tard emporté l'indépendance à Bannockburn en 1314.",
  "Which of these people campaigned to abolish the slave trade?":
    "Laquelle de ces personnes a fait campagne pour abolir la traite ?",
  "Wilberforce led the parliamentary campaign that ended the trade in 1807.":
    "Wilberforce a mené au Parlement la campagne qui a mis fin à la traite en 1807.",
  "5 to 16 in England, Wales and Scotland; Northern Ireland starts at 4. In England you must stay in education or training until 18.":
    "De 5 à 16 ans en Angleterre, au pays de Galles et en Écosse ; l'Irlande du Nord commence à 4 ans. En Angleterre, il faut rester en formation ou en études jusqu'à 18 ans.",
  "111 is the NHS urgent advice line. 999 and 112 are emergencies; 101 is non-emergency police.":
    "Le 111 est la ligne de conseil urgent du NHS. Le 999 et le 112 sont les urgences ; le 101 est la police hors urgence.",
  "Which numbers reach the emergency services in the UK?":
    "Quels numéros joignent les secours au Royaume-Uni ?",
  "999 or 112": "Le 999 ou le 112",
  "111 or 101": "Le 111 ou le 101",
  "911 only": "Le 911 seulement",
  "100 or 200": "Le 100 ou le 200",
  "Both 999 and 112 are free from any phone and reach police, ambulance, fire and coastguard.":
    "Le 999 comme le 112 sont gratuits depuis n'importe quel téléphone et joignent la police, l'ambulance, les pompiers et les gardes-côtes.",
  "What does 'free at the point of use' mean for the NHS?":
    "Que veut dire 'free at the point of use' pour le NHS ?",
  "You are not charged for treatment when you receive it, because it is funded by taxation":
    "On ne vous fait pas payer les soins au moment où vous les recevez, parce qu'ils sont financés par l'impôt",
  "Only emergencies are free": "Seules les urgences sont gratuites",
  "Only citizens are treated free": "Seuls les citoyens sont soignés gratuitement",
  "Care is based on clinical need, not ability to pay, and is paid for through taxation.":
    "Les soins reposent sur le besoin médical, non sur les moyens du patient, et sont payés par l'impôt.",
  "Who is normally your first point of contact for NHS healthcare?":
    "Vers qui se tourne-t-on d'abord, normalement, pour se faire soigner par le NHS ?",
  "A hospital consultant": "Un médecin spécialiste de l'hôpital",
  "A pharmacist": "Un pharmacien",
  "The ambulance service": "Le service des ambulances",
  "A general practitioner. You need to be registered with a local practice to be referred onward for most care.":
    "Un médecin généraliste. Il faut être inscrit dans un cabinet du quartier pour être adressé plus loin dans la plupart des cas.",
  "Where are NHS prescriptions free?": "Où les ordonnances du NHS sont-elles gratuites ?",
  "Everywhere in the UK": "Partout au Royaume-Uni",
  "Scotland, Wales and Northern Ireland": "En Écosse, au pays de Galles et en Irlande du Nord",
  "England only": "En Angleterre seulement",
  "Nowhere": "Nulle part",
  "Free in Scotland, Wales and Northern Ireland; charged in England, with many exemptions.":
    "Gratuites en Écosse, au pays de Galles et en Irlande du Nord ; payantes en Angleterre, avec de nombreuses dispenses.",
  "What are the main exams taken at 16 in England, Wales and Northern Ireland?":
    "Quels sont les principaux examens passés à 16 ans en Angleterre, au pays de Galles et en Irlande du Nord ?",
  "A levels": "Les A levels",
  "GCSEs": "Les GCSEs",
  "Highers": "Les Highers",
  "Degrees": "Les diplômes universitaires",
  "GCSEs. Scotland has National Qualifications instead, and Highers in place of A levels.":
    "Les GCSEs. L'Écosse a à la place les National Qualifications, et les Highers au lieu des A levels.",
  "Which are the two oldest universities in the UK?":
    "Quelles sont les deux plus anciennes universités du Royaume-Uni ?",
  "Oxford and Cambridge": "Oxford et Cambridge",
  "Edinburgh and Glasgow": "Edinburgh et Glasgow",
  "London and Durham": "Londres et Durham",
  "St Andrews and Aberdeen": "St Andrews et Aberdeen",
  "Oxford and Cambridge. Tuition fees differ across the UK because education is devolved.":
    "Oxford et Cambridge. Les frais de scolarité varient d'une nation à l'autre parce que l'éducation est dévolue.",
  "Is misusing the 999 emergency number an offence?":
    "Le mésusage du numéro d'urgence 999 est-il une infraction ?",
  "No, it is simply discouraged": "Non, c'est simplement déconseillé",
  "Yes, it is an offence": "Oui, c'est une infraction",
  "Only if repeated": "Seulement en cas de récidive",
  "Only for businesses": "Seulement pour les entreprises",
  "999 is for a life at risk, serious injury, a crime in progress or a fire. Misusing it is an offence — 111 exists for everything else urgent.":
    "Le 999 sert quand une vie est en jeu, en cas de blessure grave, de délit en cours ou d'incendie. En mésuser est une infraction — le 111 existe pour tout le reste qui presse.",
};
