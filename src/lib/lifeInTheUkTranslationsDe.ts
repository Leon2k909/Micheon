/**
 * German for the Life in the UK course cards and headings.
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
 * around them.
 */
export const LIFE_IN_THE_UK_DE: Record<string, string> = {
  // ── Lesson titles and chapter headings ──────────────────────────────────
  // Shown under the English on the lesson cards, so you can find a topic by
  // the German name without losing the English one you will meet in the exam.
  // "Devolution" would otherwise translate to itself, which reads as a
  // forgotten paste, so it carries the short explanation German needs anyway.
  "Values and principles": "Werte und Grundsätze",
  "What is the UK?": "Was ist das Vereinigte Königreich?",
  "A long and illustrious history": "Eine lange und bedeutende Geschichte",
  "Government, the law and your role": "Regierung, Recht und deine Rolle",
  "A modern, thriving society": "Eine moderne, lebendige Gesellschaft",

  "British Values & Principles": "Britische Werte und Grundsätze",
  "The UK & Geography": "Das Vereinigte Königreich und seine Geografie",
  "National Identity & Symbols": "Nationale Identität und Symbole",
  "Early British History": "Frühe britische Geschichte",
  "Medieval Britain": "Britannien im Mittelalter",
  "The Tudors": "Die Tudors",
  "Stuarts & Civil War": "Die Stuarts und der Bürgerkrieg",
  "Britain 1700–1900": "Großbritannien 1700–1900",
  "Britain 1900–Present": "Großbritannien 1900 bis heute",
  "Important Dates & Timeline": "Wichtige Jahreszahlen und Zeitleiste",
  "The Monarchy": "Die Monarchie",
  "Government & Parliament": "Regierung und Parlament",
  "Devolution": "Devolution: die Regionalparlamente",
  "Law & Justice": "Recht und Justiz",
  "Rights & Responsibilities": "Rechte und Pflichten",
  "British Society & Culture": "Britische Gesellschaft und Kultur",
  "Religion & Beliefs": "Religion und Glaube",
  "British Traditions & Celebrations": "Britische Traditionen und Feste",
  "Sports & Leisure": "Sport und Freizeit",
  "Literature, Art & Music": "Literatur, Kunst und Musik",
  "Science & Inventions": "Wissenschaft und Erfindungen",
  "Famous British People": "Berühmte Britinnen und Briten",
  "Education & Healthcare": "Bildung und Gesundheitswesen",

  // ── 1. British Values & Principles ──────────────────────────────────────
  "The fundamental principles": "Die Grundprinzipien",
  "Equality: the nine protected characteristics": "Gleichheit: die neun geschützten Merkmale",
  "Rights and responsibilities": "Rechte und Pflichten",
  "Democracy": "Demokratie",
  "Government by the people, through representatives you elect and can vote out.":
    "Herrschaft durch das Volk, über Abgeordnete, die du wählst und auch wieder abwählen kannst.",
  "The rule of law": "Die Herrschaft des Rechts",
  "Everyone is subject to the law — including ministers, the police and the government itself.":
    "Alle unterliegen dem Gesetz – auch Minister, die Polizei und die Regierung selbst.",
  "Individual liberty": "Persönliche Freiheit",
  "Freedom to live as you choose, within the law.":
    "Die Freiheit, so zu leben, wie du möchtest – im Rahmen des Gesetzes.",
  "Equality": "Gleichheit",
  "No one may be treated less favourably because of who they are. The Equality Act 2010 makes this law.":
    "Niemand darf wegen seiner Person schlechter behandelt werden. Der Equality Act 2010 macht das zum Gesetz.",
  "Tolerance": "Toleranz",
  "Respect for those of different faiths and beliefs, and of none.":
    "Respekt gegenüber Menschen anderen Glaubens und anderer Überzeugungen – und gegenüber Menschen ohne Glauben.",
  "Respect": "Respekt",
  "For other people, for their property, and for the environment you share.":
    "Gegenüber anderen Menschen, ihrem Eigentum und der gemeinsamen Umwelt.",
  "Participation": "Teilhabe",
  "Taking part in community life — voting, volunteering, jury service.":
    "Am Gemeinschaftsleben teilnehmen – wählen, sich ehrenamtlich engagieren, Schöffendienst leisten.",
  "Your rights": "Deine Rechte",
  "Freedom of speech and of the press. Freedom of religion and belief. Freedom from unfair discrimination. A fair trial. A vote in a free election.":
    "Meinungs- und Pressefreiheit. Religions- und Glaubensfreiheit. Schutz vor unfairer Diskriminierung. Ein faires Gerichtsverfahren. Eine Stimme bei freien Wahlen.",
  "Your responsibilities": "Deine Pflichten",
  "Obey the law. Pay tax and National Insurance. Serve on a jury when called. Respect the rights of others. Look after the area you live in.":
    "Das Gesetz befolgen. Steuern und National Insurance zahlen. Dem Ruf zum Schöffendienst folgen. Die Rechte anderer achten. Auf deine Wohngegend achten.",

  // ── 2. The UK & Geography ───────────────────────────────────────────────
  "The four nations and their capitals": "Die vier Nationen und ihre Hauptstädte",
  "Other important cities": "Weitere wichtige Städte",
  "Regions and counties": "Regionen und Grafschaften",
  "Rivers": "Flüsse",
  "Mountains and high ground": "Berge und Hochland",
  "Lakes and lochs": "Seen und Lochs",
  "Islands and surrounding seas": "Inseln und umliegende Meere",
  "National Parks and famous places": "Nationalparks und berühmte Orte",
  "Languages": "Sprachen",
  "England — London": "England – London",
  "Also the capital of the UK as a whole, and the seat of the UK Parliament. By far the largest nation by population.":
    "Zugleich die Hauptstadt des gesamten Vereinigten Königreichs und Sitz des UK Parliament. Mit Abstand die bevölkerungsreichste Nation.",
  "Scotland — Edinburgh": "Schottland – Edinburgh",
  "Home of the Scottish Parliament, at Holyrood. Glasgow is Scotland's largest city.":
    "Sitz des Scottish Parliament in Holyrood. Glasgow ist die größte Stadt Schottlands.",
  "Wales — Cardiff": "Wales – Cardiff",
  "Home of the Welsh Parliament, the Senedd. Swansea and Newport are the other large cities.":
    "Sitz des walisischen Parlaments, der Senedd. Swansea und Newport sind die weiteren großen Städte.",
  "Northern Ireland — Belfast": "Nordirland – Belfast",
  "Home of the Northern Ireland Assembly, at Stormont. Londonderry/Derry is the second city.":
    "Sitz der Northern Ireland Assembly in Stormont. Londonderry/Derry ist die zweitgrößte Stadt.",
  "England": "England",
  "Birmingham, Manchester, Liverpool, Leeds, Sheffield, Bristol, Newcastle upon Tyne, Oxford and Cambridge.":
    "Birmingham, Manchester, Liverpool, Leeds, Sheffield, Bristol, Newcastle upon Tyne, Oxford und Cambridge.",
  "Scotland": "Schottland",
  "Glasgow (the largest), Aberdeen, Dundee, Inverness and Stirling.":
    "Glasgow (die größte), Aberdeen, Dundee, Inverness und Stirling.",
  "Wales": "Wales",
  "Swansea, Newport, Bangor, and St Davids — the smallest city in Britain.":
    "Swansea, Newport, Bangor und St Davids – die kleinste Stadt Großbritanniens.",
  "Northern Ireland": "Nordirland",
  "Londonderry/Derry, Lisburn, Newry and Armagh.": "Londonderry/Derry, Lisburn, Newry und Armagh.",
  "Severn": "Severn",
  "The longest river in the UK, at about 220 miles. It rises in Wales and reaches the sea through the Bristol Channel.":
    "Der längste Fluss im Vereinigten Königreich, rund 220 Meilen. Er entspringt in Wales und mündet über den Bristol Channel ins Meer.",
  "Thames": "Themse",
  "Flows through Oxford, Reading and London. The second longest, and the most famous.":
    "Fließt durch Oxford, Reading und London. Der zweitlängste und bekannteste Fluss.",
  "Trent, Mersey, Tyne": "Trent, Mersey, Tyne",
  "Major English rivers — the Mersey at Liverpool, the Tyne at Newcastle upon Tyne.":
    "Wichtige englische Flüsse – der Mersey bei Liverpool, der Tyne bei Newcastle upon Tyne.",
  "Clyde, Tay and Bann": "Clyde, Tay und Bann",
  "The Clyde flows through Glasgow; the Tay is Scotland's longest. In Northern Ireland the Bann is the principal river.":
    "Der Clyde fließt durch Glasgow, der Tay ist Schottlands längster Fluss. In Nordirland ist der Bann der Hauptfluss.",
  "Ben Nevis — 1,345 m": "Ben Nevis – 1.345 m",
  "In the Scottish Highlands. The highest mountain in Scotland and in the whole UK.":
    "In den schottischen Highlands. Der höchste Berg Schottlands und des gesamten Vereinigten Königreichs.",
  "Snowdon (Yr Wyddfa) — 1,085 m": "Snowdon (Yr Wyddfa) – 1.085 m",
  "In Snowdonia (Eryri). The highest mountain in Wales.":
    "In Snowdonia (Eryri). Der höchste Berg von Wales.",
  "Scafell Pike — 978 m": "Scafell Pike – 978 m",
  "In the Lake District. The highest mountain in England.":
    "Im Lake District. Der höchste Berg Englands.",
  "Slieve Donard — 850 m": "Slieve Donard – 850 m",
  "In the Mourne Mountains. The highest in Northern Ireland.":
    "In den Mourne Mountains. Der höchste Berg Nordirlands.",
  "Islands": "Inseln",
  "The Isle of Wight, the Isles of Scilly, Anglesey, the Hebrides, Orkney and Shetland.":
    "Die Isle of Wight, die Scilly-Inseln, Anglesey, die Hebriden, Orkney und Shetland.",
  "Not UK islands": "Keine UK-Inseln",
  "The Isle of Man and the Channel Islands are Crown Dependencies — self-governing and linked to the Crown, not part of the UK.":
    "Die Isle of Man und die Kanalinseln sind Crown Dependencies – selbstverwaltet und mit der Krone verbunden, aber nicht Teil des Vereinigten Königreichs.",
  "Seas": "Meere",
  "The North Sea to the east, the English Channel to the south, the Irish Sea to the west, and the Atlantic Ocean to the north and west.":
    "Die Nordsee im Osten, der Ärmelkanal im Süden, die Irische See im Westen und der Atlantik im Norden und Westen.",
  "The Channel Tunnel": "Der Kanaltunnel",
  "Opened in 1994, linking Folkestone in England with Coquelles in France — the UK's only fixed land link to the continent.":
    "1994 eröffnet, verbindet Folkestone in England mit Coquelles in Frankreich – die einzige feste Landverbindung des Vereinigten Königreichs zum Kontinent.",

  // ── 3. National Identity & Symbols ──────────────────────────────────────
  "The Union Flag": "Die Union Flag",
  "The four national flags": "Die vier Nationalflaggen",
  "Patron saints and their days": "Schutzheilige und ihre Tage",
  "National flowers and plants": "Nationalblumen und -pflanzen",
  "Other national symbols": "Weitere Nationalsymbole",
  "National anthem": "Nationalhymne",
  "St George's Cross — a red cross on a white background.":
    "St George's Cross – ein rotes Kreuz auf weißem Grund.",
  "The Saltire — a white diagonal cross on a blue background.":
    "Der Saltire – ein weißes Schrägkreuz auf blauem Grund.",
  "Y Ddraig Goch, the Red Dragon, on a green and white field.":
    "Y Ddraig Goch, der Rote Drache, auf grün-weißem Grund.",
  "St Patrick's Cross — a red diagonal cross on white — is the element carried into the Union Flag.":
    "St Patrick's Cross – ein rotes Schrägkreuz auf Weiß – ist das Element, das in die Union Flag übernommen wurde.",
  "St David — 1 March": "St David – 1. März",
  "Wales. Dewi Sant in Welsh.": "Wales. Auf Walisisch Dewi Sant.",
  "St Patrick — 17 March": "St Patrick – 17. März",
  "Northern Ireland. A bank holiday there.": "Nordirland. Dort ein gesetzlicher Feiertag.",
  "St George — 23 April": "St George – 23. April",
  "St Andrew — 30 November": "St Andrew – 30. November",
  "Scotland. St Andrew's Day is a bank holiday in Scotland.":
    "Schottland. Der St Andrew's Day ist in Schottland ein gesetzlicher Feiertag.",
  "England — the Rose": "England – die Rose",
  "The Tudor rose, red and white, dating from the end of the Wars of the Roses.":
    "Die Tudor-Rose in Rot und Weiß, entstanden am Ende der Rosenkriege.",
  "Scotland — the Thistle": "Schottland – die Distel",
  "A spiny purple flower, Scotland's emblem for centuries.":
    "Eine stachelige violette Blüte, seit Jahrhunderten Schottlands Wahrzeichen.",
  "Wales — the Daffodil": "Wales – die Osterglocke",
  "Worn on St David's Day. The leek is also a Welsh emblem.":
    "Wird am St David's Day getragen. Auch der Lauch ist ein walisisches Wahrzeichen.",
  "Northern Ireland — the Shamrock": "Nordirland – das Kleeblatt",
  "The three-leaved clover, associated with St Patrick.":
    "Das dreiblättrige Kleeblatt, verbunden mit St Patrick.",

  // ── 4. Early British History ────────────────────────────────────────────
  "Stone Age, Bronze Age and Iron Age": "Steinzeit, Bronzezeit und Eisenzeit",
  "The Romans": "Die Römer",
  "The Anglo-Saxons": "Die Angelsachsen",
  "The Vikings and the Danelaw": "Die Wikinger und das Danelaw",
  "The Norman Conquest": "Die normannische Eroberung",
  "Stone Age": "Steinzeit",
  "Hunter-gatherers first, then the first farmers around 6,000 years ago. They built **Stonehenge** and the tombs at **Skara Brae** in Orkney.":
    "Zuerst Jäger und Sammler, dann vor rund 6.000 Jahren die ersten Bauern. Sie errichteten **Stonehenge** und die Gräber von **Skara Brae** auf Orkney.",
  "Bronze Age": "Bronzezeit",
  "From about 4,000 years ago. People learned to make bronze, lived in roundhouses and buried their dead in barrows.":
    "Ab etwa vor 4.000 Jahren. Die Menschen lernten Bronze herzustellen, lebten in Rundhäusern und bestatteten ihre Toten in Hügelgräbern.",
  "Iron Age": "Eisenzeit",
  "Iron tools and weapons, hill forts such as **Maiden Castle**, and the first British coins. The people are known as the **Celts**.":
    "Werkzeuge und Waffen aus Eisen, Höhenburgen wie **Maiden Castle** und die ersten britischen Münzen. Diese Menschen nennt man **Kelten**.",

  // ── 5. Medieval Britain ─────────────────────────────────────────────────
  "The Normans": "Die Normannen",
  "Magna Carta": "Magna Carta",
  "Wales and Scotland": "Wales und Schottland",
  "The Hundred Years War": "Der Hundertjährige Krieg",
  "The Black Death and the Peasants Revolt": "Der Schwarze Tod und der Bauernaufstand",
  "The Wars of the Roses": "Die Rosenkriege",
  "William the Conqueror": "Wilhelm der Eroberer",
  "Won the **Battle of Hastings** in **1066** and became William I. Built castles across England, including the Tower of London.":
    "Gewann **1066** die **Schlacht von Hastings** und wurde Wilhelm I. Er ließ überall in England Burgen bauen, darunter den Tower of London.",
  "The Domesday Book": "Das Domesday Book",
  "Ordered by William in **1086** — a survey of who owned what land, and what it was worth, across England.":
    "**1086** von Wilhelm in Auftrag gegeben – eine Erhebung darüber, wem welches Land gehörte und was es wert war, in ganz England.",
  "The feudal system": "Das Feudalsystem",
  "The king owned all land and granted it to nobles in return for service; peasants worked it in return for protection.":
    "Dem König gehörte alles Land; er vergab es an Adlige gegen Dienste, und Bauern bearbeiteten es im Gegenzug für Schutz.",
  "William Wallace": "William Wallace",
  "Led Scottish resistance to Edward I. Captured and executed in 1305, and remembered as a national hero.":
    "Führte den schottischen Widerstand gegen Eduard I. an. 1305 gefangen genommen und hingerichtet, bis heute ein Nationalheld.",
  "Robert the Bruce": "Robert the Bruce",
  "Crowned King of Scots, he defeated the English at the **Battle of Bannockburn in 1314**, securing Scottish independence.":
    "Zum König der Schotten gekrönt, besiegte er die Engländer **1314 in der Schlacht von Bannockburn** und sicherte damit die schottische Unabhängigkeit.",
  "The result": "Das Ergebnis",
  "Scotland stayed a separate kingdom for nearly 400 more years, until the Act of Union of 1707.":
    "Schottland blieb fast 400 weitere Jahre ein eigenes Königreich, bis zum Act of Union von 1707.",

  // ── 6. The Tudors ───────────────────────────────────────────────────────
  "Henry VII and Henry VIII": "Heinrich VII. und Heinrich VIII.",
  "The Reformation": "Die Reformation",
  "Edward VI, Mary I and Elizabeth I": "Eduard VI., Maria I. und Elisabeth I.",
  "The Spanish Armada": "Die Spanische Armada",
  "Shakespeare": "Shakespeare",
  "Catherine of Aragon": "Katharina von Aragón",
  "Divorced. Mother of Mary I. The refusal of the Pope to annul this marriage triggered the Reformation in England.":
    "Geschieden. Mutter von Maria I. Die Weigerung des Papstes, diese Ehe zu annullieren, löste die Reformation in England aus.",
  "Anne Boleyn": "Anne Boleyn",
  "Beheaded. Mother of Elizabeth I.": "Enthauptet. Mutter von Elisabeth I.",
  "Jane Seymour": "Jane Seymour",
  "Died — shortly after giving birth to Edward VI, Henry's only surviving son.":
    "Gestorben – kurz nach der Geburt Eduards VI., Heinrichs einzigem überlebenden Sohn.",
  "Anne of Cleves": "Anna von Kleve",
  "Divorced. A political match that Henry disliked on sight.":
    "Geschieden. Eine politische Verbindung, die Heinrich auf den ersten Blick missfiel.",
  "Catherine Howard": "Catherine Howard",
  "Beheaded.": "Enthauptet.",
  "Catherine Parr": "Catherine Parr",
  "Survived him, and outlived Henry by a year.": "Überlebte ihn – sie starb ein Jahr nach Heinrich.",
  "Edward VI": "Eduard VI.",
  "Henry's young son. Strongly Protestant — the Book of Common Prayer dates from his reign. He died at 15.":
    "Heinrichs junger Sohn. Streng protestantisch – das Book of Common Prayer stammt aus seiner Regierungszeit. Er starb mit 15.",
  "Mary I": "Maria I.",
  "A devout Catholic who reversed the Reformation and had Protestants executed, earning the name Bloody Mary.":
    "Eine gläubige Katholikin, die die Reformation rückgängig machte und Protestanten hinrichten ließ – daher der Beiname Bloody Mary.",
  "Elizabeth I": "Elisabeth I.",
  "Protestant, and reigned 45 years. She found a middle way in religion that largely held, and never married.":
    "Protestantin, regierte 45 Jahre. Sie fand in Glaubensfragen einen Mittelweg, der weitgehend hielt, und heiratete nie.",

  // ── 7. Stuarts & Civil War ──────────────────────────────────────────────
  "James I and the Gunpowder Plot": "Jakob I. und das Schießpulver-Attentat",
  "Charles I and the English Civil War": "Karl I. und der Englische Bürgerkrieg",
  "Cromwell and the Commonwealth": "Cromwell und das Commonwealth",
  "The Restoration": "Die Restauration",
  "The Glorious Revolution and the Bill of Rights": "Die Glorious Revolution und die Bill of Rights",
  "Cavaliers": "Cavaliers",
  "Supporters of the King. Also called Royalists.":
    "Anhänger des Königs. Auch Royalisten genannt.",
  "Roundheads": "Roundheads",
  "Supporters of Parliament, named for their short haircuts. Also called Parliamentarians.":
    "Anhänger des Parlaments, benannt nach ihren kurzen Haaren. Auch Parlamentarier genannt.",
  "The outcome": "Der Ausgang",
  "Parliament won. Charles I was tried and **executed in 1649** — the only English king ever put to death by his own subjects.":
    "Das Parlament siegte. Karl I. wurde vor Gericht gestellt und **1649 hingerichtet** – der einzige englische König, der je von seinen eigenen Untertanen getötet wurde.",

  // ── 8. Britain 1700–1900 ────────────────────────────────────────────────
  "The Act of Union and the Jacobites": "Der Act of Union und die Jakobiten",
  "The Industrial Revolution": "Die Industrielle Revolution",
  "Empire, slavery and abolition": "Empire, Sklaverei und Abschaffung",
  "Wars and revolutions": "Kriege und Revolutionen",
  "Victorian Britain": "Das viktorianische Großbritannien",
  "Reform and reformers": "Reformen und Reformer",
  "The steam engine": "Die Dampfmaschine",
  "**James Watt** improved it decisively. Steam powered factories, mines, ships and trains.":
    "**James Watt** verbesserte sie entscheidend. Dampf trieb Fabriken, Bergwerke, Schiffe und Züge an.",
  "Railways": "Eisenbahnen",
  "**George Stephenson** built the Rocket. Britain built the first passenger railways, and the network transformed travel and trade.":
    "**George Stephenson** baute die Rocket. Großbritannien errichtete die ersten Personenbahnen, und das Netz veränderte Reisen und Handel grundlegend.",
  "Factories": "Fabriken",
  "Textiles led the way. Conditions were harsh, and child labour was common until reforming laws restricted it.":
    "Die Textilindustrie ging voran. Die Bedingungen waren hart, und Kinderarbeit war üblich, bis Reformgesetze sie einschränkten.",
  "Engineering": "Ingenieurwesen",
  "**Isambard Kingdom Brunel** built the Great Western Railway, bridges, tunnels and steamships — the most famous engineer of the age.":
    "**Isambard Kingdom Brunel** baute die Great Western Railway, Brücken, Tunnel und Dampfschiffe – der berühmteste Ingenieur seiner Zeit.",
  "American Revolution": "Amerikanische Revolution",
  "The thirteen American colonies declared independence in **1776** and won it. Britain lost its most valuable settler colonies.":
    "Die dreizehn amerikanischen Kolonien erklärten **1776** ihre Unabhängigkeit und errangen sie. Großbritannien verlor seine wertvollsten Siedlerkolonien.",
  "Napoleonic Wars": "Napoleonische Kriege",
  "Britain fought France under Napoleon for over twenty years.":
    "Großbritannien kämpfte über zwanzig Jahre lang gegen Frankreich unter Napoleon.",
  "Trafalgar, 1805": "Trafalgar, 1805",
  "**Admiral Nelson** destroyed the French and Spanish fleets at sea and was killed in the battle. Nelson's Column stands in Trafalgar Square.":
    "**Admiral Nelson** vernichtete die französische und spanische Flotte auf See und fiel in der Schlacht. Die Nelson's Column steht am Trafalgar Square.",
  "Waterloo, 1815": "Waterloo, 1815",
  "The **Duke of Wellington** finally defeated Napoleon on land, ending the wars.":
    "Der **Duke of Wellington** besiegte Napoleon schließlich zu Lande und beendete damit die Kriege.",
  "Florence Nightingale": "Florence Nightingale",
  "Founded modern nursing during the Crimean War and set up the first nursing school, at St Thomas' Hospital in London.":
    "Begründete während des Krimkriegs die moderne Krankenpflege und gründete die erste Pflegeschule am St Thomas' Hospital in London.",
  "Charles Darwin": "Charles Darwin",
  "Published *On the Origin of Species* in 1859, setting out evolution by natural selection.":
    "Veröffentlichte 1859 *On the Origin of Species* und legte darin die Evolution durch natürliche Auslese dar.",
  "Charles Dickens": "Charles Dickens",
  "Novelist whose books — *Oliver Twist*, *Great Expectations* — exposed the poverty of industrial Britain.":
    "Romancier, dessen Bücher – *Oliver Twist*, *Great Expectations* – die Armut im industriellen Großbritannien offenlegten.",
  "Emmeline Pankhurst": "Emmeline Pankhurst",
  "Later in the century she began organising the campaign that became the suffragette movement.":
    "Später im Jahrhundert begann sie die Kampagne zu organisieren, aus der die Suffragetten-Bewegung wurde.",

  // ── 9. Britain 1900–Present ─────────────────────────────────────────────
  "The First World War": "Der Erste Weltkrieg",
  "Votes for women": "Das Frauenwahlrecht",
  "The Second World War": "Der Zweite Weltkrieg",
  "The Welfare State and the NHS": "Der Sozialstaat und der NHS",
  "Empire to Commonwealth": "Vom Empire zum Commonwealth",
  "Immigration and modern Britain": "Einwanderung und das moderne Großbritannien",
  "Europe and Brexit": "Europa und der Brexit",
  "Dunkirk, 1940": "Dünkirchen, 1940",
  "British and Allied troops were evacuated from France by warships and hundreds of small civilian boats.":
    "Britische und alliierte Truppen wurden mit Kriegsschiffen und Hunderten kleiner ziviler Boote aus Frankreich evakuiert.",
  "The Battle of Britain, 1940": "Die Luftschlacht um England, 1940",
  "The RAF held off the German air force, preventing invasion. Churchill: never was so much owed by so many to so few.":
    "Die RAF hielt die deutsche Luftwaffe ab und verhinderte eine Invasion. Churchill: Nie schuldeten so viele so wenigen so viel.",
  "The Blitz": "Der Blitz",
  "German bombing of London and other cities — Coventry, Liverpool, Glasgow, Belfast — night after night.":
    "Deutsche Bombenangriffe auf London und andere Städte – Coventry, Liverpool, Glasgow, Belfast – Nacht für Nacht.",
  "D-Day, 6 June 1944": "D-Day, 6. Juni 1944",
  "Allied forces landed in Normandy, opening the campaign that liberated western Europe.":
    "Alliierte Truppen landeten in der Normandie und eröffneten den Feldzug, der Westeuropa befreite.",

  // ── 10. Important Dates & Timeline ──────────────────────────────────────
  "Before the Norman Conquest": "Vor der normannischen Eroberung",
  "1066 to 1500": "1066 bis 1500",
  "The Tudors and Stuarts": "Die Tudors und Stuarts",
  "1700 to 1900": "1700 bis 1900",
  "1900 to today": "1900 bis heute",
  "c. 6000 BC": "ca. 6000 v. Chr.",
  "Britain is cut off from the continent as the land bridge floods.":
    "Großbritannien wird vom Festland getrennt, als die Landbrücke überflutet wird.",
  "c. 2500 BC": "ca. 2500 v. Chr.",
  "Stonehenge is built. Skara Brae in Orkney is occupied.":
    "Stonehenge wird errichtet. Skara Brae auf Orkney ist bewohnt.",
  "55 BC": "55 v. Chr.",
  "Julius Caesar's expedition — and it fails.": "Julius Caesars Feldzug – und er scheitert.",
  "AD 43": "43 n. Chr.",
  "Claudius invades. The Roman conquest of Britain begins.":
    "Claudius fällt ein. Die römische Eroberung Britanniens beginnt.",
  "AD 122": "122 n. Chr.",
  "Hadrian's Wall is begun across northern England.":
    "Der Bau des Hadrianswalls quer durch Nordengland beginnt.",
  "AD 410": "410 n. Chr.",
  "The Romans leave Britain.": "Die Römer verlassen Britannien.",
  "AD 789": "789 n. Chr.",
  "The first Viking raids.": "Die ersten Wikingerüberfälle.",
  "AD 878": "878 n. Chr.",
  "Alfred the Great defeats the Vikings; the Danelaw is agreed.":
    "Alfred der Große besiegt die Wikinger; das Danelaw wird vereinbart.",
  "1066": "1066",
  "Battle of Hastings. William the Conqueror takes the throne.":
    "Schlacht von Hastings. Wilhelm der Eroberer besteigt den Thron.",
  "1086": "1086",
  "The Domesday Book.": "Das Domesday Book.",
  "1215": "1215",
  "Magna Carta — King John accepts that the king is bound by law.":
    "Magna Carta – König Johann erkennt an, dass auch der König an das Gesetz gebunden ist.",
  "1284": "1284",
  "The Statute of Rhuddlan annexes Wales to the English Crown.":
    "Das Statute of Rhuddlan gliedert Wales der englischen Krone an.",
  "1314": "1314",
  "Robert the Bruce wins at Bannockburn.": "Robert the Bruce siegt bei Bannockburn.",
  "1337–1453": "1337–1453",
  "The Hundred Years War with France.": "Der Hundertjährige Krieg gegen Frankreich.",
  "1348": "1348",
  "The Black Death reaches Britain.": "Der Schwarze Tod erreicht Britannien.",
  "1381": "1381",
  "The Peasants Revolt.": "Der Bauernaufstand.",
  "1415": "1415",
  "Henry V wins at Agincourt.": "Heinrich V. siegt bei Azincourt.",
  "1485": "1485",
  "Battle of Bosworth Field ends the Wars of the Roses. The Tudors begin.":
    "Die Schlacht von Bosworth Field beendet die Rosenkriege. Die Tudor-Zeit beginnt.",
  "1534": "1534",
  "Henry VIII breaks with Rome and becomes Head of the Church of England.":
    "Heinrich VIII. bricht mit Rom und wird Oberhaupt der Church of England.",
  "1588": "1588",
  "The Spanish Armada is defeated.": "Die Spanische Armada wird besiegt.",
  "1603": "1603",
  "James VI of Scotland becomes James I of England.":
    "Jakob VI. von Schottland wird Jakob I. von England.",
  "1605": "1605",
  "The Gunpowder Plot fails — remembered every 5 November.":
    "Das Schießpulver-Attentat scheitert – erinnert wird daran jedes Jahr am 5. November.",
  "1642–1651": "1642–1651",
  "The English Civil War.": "Der Englische Bürgerkrieg.",
  "1649": "1649",
  "Charles I is executed. The Commonwealth begins under Cromwell.":
    "Karl I. wird hingerichtet. Unter Cromwell beginnt das Commonwealth.",
  "1660": "1660",
  "The Restoration — Charles II returns.": "Die Restauration – Karl II. kehrt zurück.",
  "1666": "1666",
  "The Great Fire of London.": "Der Große Brand von London.",
  "1688": "1688",
  "The Glorious Revolution. William and Mary take the throne.":
    "Die Glorious Revolution. Wilhelm und Maria besteigen den Thron.",
  "1689": "1689",
  "The Bill of Rights makes the monarchy constitutional.":
    "Die Bill of Rights macht die Monarchie zu einer konstitutionellen.",
  "1707": "1707",
  "The Act of Union joins England and Scotland as Great Britain.":
    "Der Act of Union vereint England und Schottland zu Großbritannien.",
  "1746": "1746",
  "Battle of Culloden — the last battle fought on British soil.":
    "Die Schlacht von Culloden – die letzte Schlacht auf britischem Boden.",
  "1776": "1776",
  "The American colonies declare independence.":
    "Die amerikanischen Kolonien erklären ihre Unabhängigkeit.",
  "1801": "1801",
  "The Act of Union with Ireland creates the United Kingdom.":
    "Der Act of Union mit Irland schafft das Vereinigte Königreich.",
  "1805": "1805",
  "Nelson wins at Trafalgar.": "Nelson siegt bei Trafalgar.",
  "1807": "1807",
  "The slave trade is abolished.": "Der Sklavenhandel wird abgeschafft.",
  "1815": "1815",
  "Wellington defeats Napoleon at Waterloo.":
    "Wellington besiegt Napoleon bei Waterloo.",
  "1832": "1832",
  "The Reform Act begins widening the vote.":
    "Der Reform Act beginnt das Wahlrecht auszuweiten.",
  "1833": "1833",
  "Slavery itself is abolished across the Empire.":
    "Die Sklaverei selbst wird im gesamten Empire abgeschafft.",
  "1837–1901": "1837–1901",
  "The reign of Queen Victoria.": "Die Regierungszeit von Königin Victoria.",
  "1851": "1851",
  "The Great Exhibition.": "Die Weltausstellung (Great Exhibition).",
  "1859": "1859",
  "Darwin publishes On the Origin of Species.":
    "Darwin veröffentlicht On the Origin of Species.",
  "1914–1918": "1914–1918",
  "The First World War. It ends on 11 November 1918.":
    "Der Erste Weltkrieg. Er endet am 11. November 1918.",
  "1918": "1918",
  "Women over 30 with property win the vote.":
    "Frauen über 30 mit Grundbesitz erhalten das Wahlrecht.",
  "1928": "1928",
  "Women win the vote on equal terms with men, at 21.":
    "Frauen erhalten das Wahlrecht zu denselben Bedingungen wie Männer, ab 21.",
  "1939–1945": "1939–1945",
  "The Second World War. VE Day is 8 May 1945.":
    "Der Zweite Weltkrieg. Der VE Day ist der 8. Mai 1945.",
  "1940": "1940",
  "The Battle of Britain and the Blitz. Churchill becomes Prime Minister.":
    "Die Luftschlacht um England und der Blitz. Churchill wird Premierminister.",
  "1944": "1944",
  "D-Day, 6 June — the Normandy landings.":
    "D-Day, 6. Juni – die Landung in der Normandie.",
  "1947": "1947",
  "India and Pakistan become independent.":
    "Indien und Pakistan werden unabhängig.",
  "1948": "1948",
  "The NHS is founded. The Empire Windrush arrives.":
    "Der NHS wird gegründet. Die Empire Windrush trifft ein.",
  "1973": "1973",
  "The UK joins the European Economic Community.":
    "Das Vereinigte Königreich tritt der Europäischen Wirtschaftsgemeinschaft bei.",
  "1979": "1979",
  "Margaret Thatcher becomes the first woman Prime Minister.":
    "Margaret Thatcher wird die erste Premierministerin.",
  "1998": "1998",
  "The Good Friday Agreement.": "Das Karfreitagsabkommen.",
  "1999": "1999",
  "The Scottish Parliament and Welsh Assembly open.":
    "Das Scottish Parliament und die walisische Versammlung nehmen ihre Arbeit auf.",
  "2012": "2012",
  "London hosts the Olympic Games.": "London richtet die Olympischen Spiele aus.",
  "2016": "2016",
  "The referendum votes to leave the EU.":
    "Das Referendum entscheidet sich für den Austritt aus der EU.",
  "2020": "2020",
  "The UK formally leaves the EU on 31 January.":
    "Das Vereinigte Königreich verlässt die EU offiziell am 31. Januar.",
  "2022": "2022",
  "Queen Elizabeth II dies; King Charles III succeeds.":
    "Königin Elisabeth II. stirbt; König Charles III. folgt ihr nach.",

  // ── 11. The Monarchy ────────────────────────────────────────────────────
  "What the monarch actually does": "Was der Monarch tatsächlich tut",
  "Succession and coronation": "Thronfolge und Krönung",
  "The Royal Family": "Die königliche Familie",
  "Monarchs worth knowing": "Monarchen, die man kennen sollte",
  "Royal Assent": "Royal Assent",
  "Every Act of Parliament needs the monarch's signature to become law. It has not been refused since 1708 — it is a formality.":
    "Jedes Gesetz des Parlaments braucht die Unterschrift des Monarchen, um in Kraft zu treten. Seit 1708 wurde sie nie verweigert – es ist eine Formsache.",
  "State Opening of Parliament": "State Opening of Parliament",
  "The monarch opens each parliamentary year and reads a speech setting out the government's plans. The speech is written by the government, not the monarch.":
    "Der Monarch eröffnet jedes Parlamentsjahr und verliest eine Rede mit den Plänen der Regierung. Die Rede schreibt die Regierung, nicht der Monarch.",
  "Appointing the Prime Minister": "Die Ernennung des Premierministers",
  "The monarch invites the leader who can command a majority in the House of Commons to form a government.":
    "Der Monarch bittet die Person, die im House of Commons eine Mehrheit hinter sich hat, eine Regierung zu bilden.",
  "Ceremonial and representative": "Zeremoniell und Repräsentation",
  "State visits, honours, and representing the UK abroad. Also Head of the Commonwealth.":
    "Staatsbesuche, Ordensverleihungen und die Vertretung des Landes im Ausland. Zudem Oberhaupt des Commonwealth.",
  "William I": "Wilhelm I.",
  "1066 — the Norman Conquest.": "1066 – die normannische Eroberung.",
  "Henry VIII": "Heinrich VIII.",
  "Six wives, and the break with Rome.": "Sechs Ehefrauen und der Bruch mit Rom.",
  "45 years, the Armada, and the Elizabethan age.":
    "45 Jahre Regierungszeit, die Armada und das elisabethanische Zeitalter.",
  "Charles I": "Karl I.",
  "Executed in 1649 after the Civil War.":
    "1649 nach dem Bürgerkrieg hingerichtet.",
  "Victoria": "Victoria",
  "1837–1901, the height of empire.": "1837–1901, der Höhepunkt des Empire.",
  "Elizabeth II": "Elisabeth II.",
  "1952–2022, the longest reign in British history.":
    "1952–2022, die längste Regierungszeit der britischen Geschichte.",

  // ── 12. Government & Parliament ─────────────────────────────────────────
  "The two Houses": "Die beiden Kammern",
  "Government, Cabinet and Opposition": "Regierung, Kabinett und Opposition",
  "Elections and voting": "Wahlen und Abstimmung",
  "How a law is made": "Wie ein Gesetz entsteht",
  "Local government": "Kommunalverwaltung",
  "House of Commons": "House of Commons",
  "**650 elected MPs**, one for each constituency. This is the chamber that matters: it makes law, controls tax and spending, and the government must hold its confidence.":
    "**650 gewählte Abgeordnete**, einer je Wahlkreis. Dies ist die entscheidende Kammer: Sie macht Gesetze, kontrolliert Steuern und Ausgaben, und die Regierung braucht ihr Vertrauen.",
  "House of Lords": "House of Lords",
  "**Not elected.** Members are appointed — life peers, some hereditary peers, and senior bishops of the Church of England. It revises and scrutinises bills and can delay them, but cannot block the Commons indefinitely.":
    "**Nicht gewählt.** Die Mitglieder werden ernannt – Peers auf Lebenszeit, einige Erbadlige und hohe Bischöfe der Church of England. Sie überarbeitet und prüft Gesetzentwürfe und kann sie verzögern, das Unterhaus aber nicht dauerhaft blockieren.",
  "The Prime Minister": "Der Premierminister",
  "The leader of the party that can command a majority in the Commons. Lives and works at **10 Downing Street**.":
    "Die Person an der Spitze der Partei, die im Unterhaus eine Mehrheit hat. Wohnt und arbeitet in der **10 Downing Street**.",
  "The Cabinet": "Das Kabinett",
  "About 20 senior ministers chosen by the PM, each running a department — Chancellor of the Exchequer, Home Secretary, Foreign Secretary and so on.":
    "Rund 20 leitende Ministerinnen und Minister, vom Premierminister ausgewählt, die je ein Ressort führen – Chancellor of the Exchequer, Home Secretary, Foreign Secretary und so weiter.",
  "The Opposition": "Die Opposition",
  "The largest party not in government. Its leader is **Leader of the Opposition** and heads a shadow cabinet that challenges each minister.":
    "Die größte Partei außerhalb der Regierung. Ihre Spitze ist **Leader of the Opposition** und führt ein Schattenkabinett, das jedem Ministerium gegenübersteht.",
  "The Speaker": "Der Speaker",
  "Chairs debates in the Commons, keeps order and is politically neutral — the Speaker gives up party allegiance.":
    "Leitet die Debatten im Unterhaus, sorgt für Ordnung und ist politisch neutral – der Speaker gibt seine Parteizugehörigkeit auf.",
  "Who can vote": "Wer wählen darf",
  "You must be **18 or over** and on the **electoral register**. British, Irish and qualifying Commonwealth citizens may vote in general elections.":
    "Du musst **mindestens 18** sein und im **Wählerverzeichnis** stehen. Britische, irische und bestimmte Commonwealth-Staatsangehörige dürfen an Parlamentswahlen teilnehmen.",
  "How to vote": "Wie man wählt",
  "In person at a polling station, by post, or by proxy. Photo ID is now required at polling stations in Great Britain.":
    "Persönlich im Wahllokal, per Brief oder durch Bevollmächtigte. In Großbritannien ist im Wahllokal inzwischen ein Lichtbildausweis erforderlich.",
  "By-elections": "Nachwahlen",
  "Held in a single constituency when its MP dies or resigns between general elections.":
    "Finden in einem einzelnen Wahlkreis statt, wenn dessen Abgeordneter zwischen zwei Parlamentswahlen stirbt oder zurücktritt.",
  "Political parties": "Politische Parteien",
  "The main UK-wide parties are Conservative, Labour and the Liberal Democrats. There are also national parties such as the SNP in Scotland and Plaid Cymru in Wales.":
    "Die großen landesweiten Parteien sind Conservative, Labour und die Liberal Democrats. Dazu kommen nationale Parteien wie die SNP in Schottland und Plaid Cymru in Wales.",

  // ── 13. Devolution ──────────────────────────────────────────────────────
  "The three devolved bodies": "Die drei dezentralen Parlamente",
  "What the devolved governments control": "Worüber die Regionalregierungen bestimmen",
  "What stays with the UK Parliament": "Was beim UK Parliament bleibt",
  "Scottish Parliament": "Scottish Parliament",
  "At **Holyrood** in Edinburgh. Members are **MSPs**. It has the widest powers of the three, including some power over income tax.":
    "In **Holyrood** in Edinburgh. Die Mitglieder heißen **MSPs**. Es hat die weitesten Befugnisse der drei, einschließlich einiger Rechte bei der Einkommensteuer.",
  "Senedd Cymru": "Senedd Cymru",
  "The **Welsh Parliament**, in Cardiff. Members are **MSs**. It was called the National Assembly for Wales until 2020.":
    "Das **walisische Parlament** in Cardiff. Die Mitglieder heißen **MSs**. Bis 2020 hieß es National Assembly for Wales.",
  "Northern Ireland Assembly": "Northern Ireland Assembly",
  "At **Stormont** in Belfast. Members are **MLAs**. Created by the **Good Friday Agreement of 1998**, and power is shared between communities.":
    "In **Stormont** in Belfast. Die Mitglieder heißen **MLAs**. Geschaffen durch das **Karfreitagsabkommen von 1998**; die Macht wird zwischen den Bevölkerungsgruppen geteilt.",

  // ── 14. Law & Justice ───────────────────────────────────────────────────
  "Criminal law and civil law": "Strafrecht und Zivilrecht",
  "The courts": "Die Gerichte",
  "Who is who": "Wer ist wer",
  "Jury service": "Schöffendienst",
  "Legal aid": "Prozesskostenhilfe",
  "Criminal law": "Strafrecht",
  "Offences against society — theft, assault, dangerous driving. The state prosecutes, and the punishment can be a fine, community service or prison.":
    "Straftaten gegen die Gesellschaft – Diebstahl, Körperverletzung, gefährliches Fahren. Der Staat klagt an, die Strafe kann Geldstrafe, gemeinnützige Arbeit oder Haft sein.",
  "Civil law": "Zivilrecht",
  "Disputes between people or organisations — debt, employment, housing, discrimination. The remedy is usually compensation or an order, not punishment.":
    "Streitigkeiten zwischen Personen oder Organisationen – Schulden, Arbeit, Wohnen, Diskriminierung. Die Folge ist meist Schadensersatz oder eine Anordnung, keine Strafe.",
  "Magistrates' Court": "Magistrates' Court",
  "Handles most criminal cases in England, Wales and Northern Ireland. **Magistrates** are usually unpaid volunteers from the local community, not professional judges. In Scotland the equivalent is the Justice of the Peace Court.":
    "Verhandelt die meisten Strafsachen in England, Wales und Nordirland. **Magistrates** sind meist unbezahlte Ehrenamtliche aus der Gemeinde, keine Berufsrichter. In Schottland entspricht dem der Justice of the Peace Court.",
  "Crown Court": "Crown Court",
  "Serious criminal cases, heard before a **judge and a jury of 12**. In Scotland serious cases go to the Sheriff Court or the High Court, where a jury has 15 members.":
    "Schwere Strafsachen vor einem **Richter und zwölf Geschworenen**. In Schottland gehen schwere Fälle an den Sheriff Court oder den High Court, wo die Jury 15 Mitglieder hat.",
  "County Court": "County Court",
  "Civil cases — debt, contracts, personal injury, family matters.":
    "Zivilsachen – Schulden, Verträge, Personenschäden, Familienangelegenheiten.",
  "The Supreme Court": "The Supreme Court",
  "The highest court of appeal in the UK, sitting in London. It replaced the House of Lords in that role in 2009.":
    "Das höchste Berufungsgericht des Vereinigten Königreichs mit Sitz in London. Es löste 2009 das House of Lords in dieser Rolle ab.",
  "Judges": "Richter",
  "Independent of government. They interpret the law and make sure trials are fair. A government act found unlawful by a judge must be put right.":
    "Unabhängig von der Regierung. Sie legen das Recht aus und sorgen für faire Verfahren. Erklärt ein Richter eine Regierungsmaßnahme für rechtswidrig, muss sie korrigiert werden.",
  "Solicitors": "Solicitors",
  "Give legal advice, prepare cases and represent clients, usually in the lower courts.":
    "Beraten rechtlich, bereiten Verfahren vor und vertreten Mandanten, meist vor den unteren Gerichten.",
  "Barristers": "Barristers",
  "Specialist advocates who argue cases in the higher courts.":
    "Spezialisierte Prozessanwälte, die vor den höheren Gerichten plädieren.",
  "The police": "Die Polizei",
  "Keep order, prevent and investigate crime. They must obey the law themselves, and complaints are investigated independently.":
    "Sorgt für Ordnung, verhindert und ermittelt Straftaten. Sie muss sich selbst an das Gesetz halten, und Beschwerden werden unabhängig geprüft.",

  // ── 15. Rights & Responsibilities ───────────────────────────────────────
  "Tax and National Insurance": "Steuern und National Insurance",
  "Taking part": "Mitmachen",
  "The vote": "Das Wahlrecht",
  "At 18, in free elections, by secret ballot. Your vote cannot be seen or traced.":
    "Ab 18, bei freien Wahlen, in geheimer Abstimmung. Deine Stimme kann niemand einsehen oder zurückverfolgen.",
  "Freedom of speech": "Meinungsfreiheit",
  "To say and publish what you think — subject to laws against incitement, hatred and defamation.":
    "Zu sagen und zu veröffentlichen, was du denkst – im Rahmen der Gesetze gegen Aufwiegelung, Hass und Verleumdung.",
  "Freedom of religion": "Religionsfreiheit",
  "To follow any religion or none, to change religion, and to worship openly.":
    "Jeder Religion oder keiner zu folgen, die Religion zu wechseln und offen zu praktizieren.",
  "Protection from discrimination on any of the nine protected characteristics.":
    "Schutz vor Diskriminierung aufgrund eines der neun geschützten Merkmale.",
  "A fair trial": "Ein faires Verfahren",
  "Presumed innocent until proven guilty, with legal representation and an independent judge.":
    "Unschuldsvermutung bis zum Beweis der Schuld, mit anwaltlicher Vertretung und einem unabhängigen Richter.",
  "Human rights": "Menschenrechte",
  "Set out in the Human Rights Act 1998, which brought the European Convention on Human Rights into UK law.":
    "Festgehalten im Human Rights Act 1998, der die Europäische Menschenrechtskonvention in britisches Recht überführte.",
  "Obey the law": "Das Gesetz befolgen",
  "All of it, including laws you disagree with. Change them by campaigning and voting, not by ignoring them.":
    "Und zwar vollständig, auch Gesetze, die dir nicht gefallen. Ändere sie durch Engagement und Wahlen, nicht indem du sie ignorierst.",
  "Pay tax": "Steuern zahlen",
  "**Income tax** and **National Insurance** on what you earn. NI pays towards the state pension and some benefits.":
    "**Einkommensteuer** und **National Insurance** auf dein Einkommen. NI zahlt auf die staatliche Rente und einige Sozialleistungen ein.",
  "Attend when summoned, between 18 and 70.":
    "Erscheine, wenn du geladen wirst – zwischen 18 und 70 Jahren.",
  "Respect others": "Andere respektieren",
  "Their rights, their property, and their freedom to live differently from you.":
    "Ihre Rechte, ihr Eigentum und ihre Freiheit, anders zu leben als du.",
  "Look after your area": "Auf deine Umgebung achten",
  "Recycle, do not litter, and take part in the community.":
    "Müll trennen, nichts wegwerfen und am Gemeinschaftsleben teilnehmen.",

  // ── 16. British Society & Culture ───────────────────────────────────────
  "Family life": "Familienleben",
  "Marriage and civil partnership": "Ehe und eingetragene Partnerschaft",
  "Community and volunteering": "Gemeinschaft und Ehrenamt",
  "Everyday social values": "Alltägliche gesellschaftliche Werte",
  "Marriage": "Ehe",
  "You must be **16 or over** (18 in England, Wales and Northern Ireland since 2023) and both people must consent freely.":
    "Man muss **mindestens 16** sein (seit 2023 in England, Wales und Nordirland 18), und beide müssen frei zustimmen.",
  "Same-sex marriage": "Gleichgeschlechtliche Ehe",
  "Legal in England, Wales and Scotland since 2014, and in Northern Ireland since 2020.":
    "Seit 2014 in England, Wales und Schottland zulässig, in Nordirland seit 2020.",
  "Civil partnership": "Eingetragene Partnerschaft",
  "A legal alternative to marriage with similar rights, open to both same-sex and opposite-sex couples.":
    "Eine rechtliche Alternative zur Ehe mit ähnlichen Rechten, offen für gleich- und verschiedengeschlechtliche Paare.",
  "Forced marriage": "Zwangsheirat",
  "A **criminal offence**. Marriage requires the free consent of both people — arranged is not the same as forced.":
    "Eine **Straftat**. Eine Ehe setzt die freie Zustimmung beider voraus – arrangiert ist nicht dasselbe wie erzwungen.",

  // ── 17. Religion & Beliefs ──────────────────────────────────────────────
  "The established churches": "Die Staatskirchen",
  "The main faiths practised in the UK": "Die wichtigsten Religionen im Vereinigten Königreich",
  "Tolerance in practice": "Toleranz in der Praxis",
  "Church of England": "Church of England",
  "The **established church** in England. The monarch is its Supreme Governor and the **Archbishop of Canterbury** its senior bishop. Its bishops sit in the House of Lords. Known as the Anglican Church or, in the US, Episcopal.":
    "Die **Staatskirche** in England. Der Monarch ist ihr Supreme Governor, der **Archbishop of Canterbury** ihr ranghöchster Bischof. Ihre Bischöfe sitzen im House of Lords. Bekannt als anglikanische Kirche, in den USA als Episcopal Church.",
  "Church of Scotland": "Church of Scotland",
  "The national church of Scotland, **Presbyterian** in form. It is not governed by the monarch and has no bishops in the Lords.":
    "Die Nationalkirche Schottlands, **presbyterianisch** verfasst. Sie untersteht nicht dem Monarchen und hat keine Bischöfe im Oberhaus.",
  "Wales and Northern Ireland": "Wales und Nordirland",
  "There is **no established church** in Wales or Northern Ireland.":
    "In Wales und Nordirland gibt es **keine Staatskirche**.",
  "Christianity": "Christentum",
  "The largest faith. Includes Anglican, Roman Catholic, Presbyterian, Methodist, Baptist and Orthodox traditions.":
    "Die größte Religion. Dazu zählen anglikanische, römisch-katholische, presbyterianische, methodistische, baptistische und orthodoxe Traditionen.",
  "Islam": "Islam",
  "The second largest religion in the UK. Major festivals include Eid al-Fitr and Eid al-Adha.":
    "Die zweitgrößte Religion im Vereinigten Königreich. Wichtige Feste sind Eid al-Fitr und Eid al-Adha.",
  "Hinduism": "Hinduismus",
  "Festivals include Diwali, the festival of lights.":
    "Zu den Festen gehört Diwali, das Lichterfest.",
  "Sikhism": "Sikhismus",
  "Founded by Guru Nanak. Vaisakhi is its major festival.":
    "Von Guru Nanak begründet. Vaisakhi ist sein wichtigstes Fest.",
  "Judaism": "Judentum",
  "A long-established community. Festivals include Hanukkah, Passover and Yom Kippur.":
    "Eine seit Langem bestehende Gemeinschaft. Zu den Festen zählen Chanukka, Pessach und Jom Kippur.",
  "Buddhism": "Buddhismus",
  "Practised across the UK, with Wesak among its main observances.":
    "Im ganzen Vereinigten Königreich praktiziert, mit Wesak als einem der wichtigsten Feiertage.",

  // ── 18. British Traditions & Celebrations ───────────────────────────────
  "The Christian calendar": "Der christliche Kalender",
  "Other dates in the year": "Weitere Termine im Jahr",
  "The patron saints' days": "Die Tage der Schutzheiligen",
  "Bank holidays": "Gesetzliche Feiertage",
  "Christmas Day — 25 December": "Weihnachten – 25. Dezember",
  "A public holiday throughout the UK. Families exchange presents and eat a Christmas dinner, traditionally roast turkey.":
    "Ein gesetzlicher Feiertag im ganzen Vereinigten Königreich. Familien beschenken sich und essen ein Weihnachtsessen, traditionell Truthahnbraten.",
  "Boxing Day — 26 December": "Boxing Day – 26. Dezember",
  "A public holiday, the day after Christmas.":
    "Ein gesetzlicher Feiertag, der Tag nach Weihnachten.",
  "Good Friday": "Karfreitag",
  "A public holiday. The Friday before Easter, marking the crucifixion.":
    "Ein gesetzlicher Feiertag. Der Freitag vor Ostern, der an die Kreuzigung erinnert.",
  "Easter Sunday and Easter Monday": "Ostersonntag und Ostermontag",
  "Easter Monday is a public holiday in most of the UK. The date moves each year — Easter falls in March or April.":
    "Der Ostermontag ist in den meisten Teilen des Landes ein Feiertag. Das Datum wechselt jährlich – Ostern fällt in den März oder April.",
  "Pancake Day": "Pancake Day",
  "Shrove Tuesday, the day before Lent begins. Not a public holiday, but pancakes are eaten across the country.":
    "Faschingsdienstag, der Tag vor Beginn der Fastenzeit. Kein Feiertag, aber im ganzen Land werden Pfannkuchen gegessen.",
  "New Year's Day — 1 January": "Neujahr – 1. Januar",
  "A public holiday. In Scotland **Hogmanay** on 31 December is the bigger celebration, and 2 January is also a holiday there.":
    "Ein gesetzlicher Feiertag. In Schottland ist **Hogmanay** am 31. Dezember das größere Fest, und auch der 2. Januar ist dort frei.",
  "Valentine's Day — 14 February": "Valentinstag – 14. Februar",
  "Cards and gifts between couples. Not a holiday.":
    "Karten und Geschenke zwischen Paaren. Kein Feiertag.",
  "Mothering Sunday and Father's Day": "Muttertag und Vatertag",
  "Mothering Sunday falls in March, three weeks before Easter; Father's Day is the third Sunday in June.":
    "Der Muttertag fällt in den März, drei Wochen vor Ostern; der Vatertag ist der dritte Sonntag im Juni.",
  "Halloween — 31 October": "Halloween – 31. Oktober",
  "An ancient festival, now marked with costumes, pumpkins and trick-or-treating.":
    "Ein altes Fest, heute mit Kostümen, Kürbissen und Süßes-oder-Saures gefeiert.",
  "Bonfire Night — 5 November": "Bonfire Night – 5. November",
  "Bonfires and fireworks marking the failure of the **Gunpowder Plot of 1605**. Also called Guy Fawkes Night.":
    "Feuer und Feuerwerk zur Erinnerung an das Scheitern des **Schießpulver-Attentats von 1605**. Auch Guy Fawkes Night genannt.",
  "Remembrance Day — 11 November": "Remembrance Day – 11. November",
  "Marks the end of the First World War in 1918. Poppies are worn and there is a two-minute silence at 11am.":
    "Erinnert an das Ende des Ersten Weltkriegs 1918. Man trägt Mohnblumen, und um 11 Uhr gibt es zwei Schweigeminuten.",

  // ── 19. Sports & Leisure ────────────────────────────────────────────────
  "The major sports": "Die wichtigsten Sportarten",
  "Other sports and events": "Weitere Sportarten und Veranstaltungen",
  "Leisure": "Freizeit",
  "Football": "Fußball",
  "The most popular sport. Each nation has its own team and league; the **FA Cup** is the oldest football competition in the world.":
    "Die beliebteste Sportart. Jede Nation hat ihre eigene Mannschaft und Liga; der **FA Cup** ist der älteste Fußballwettbewerb der Welt.",
  "Rugby": "Rugby",
  "Two codes, **rugby union** and **rugby league**. The **Six Nations** is contested by England, Scotland, Wales, Ireland, France and Italy.":
    "Zwei Varianten: **Rugby Union** und **Rugby League**. Um die **Six Nations** spielen England, Schottland, Wales, Irland, Frankreich und Italien.",
  "Cricket": "Cricket",
  "Originated in England. **The Ashes** is the historic Test series between England and Australia. **Lord's** in London is the most famous ground.":
    "Entstand in England. **The Ashes** ist die traditionsreiche Test-Serie zwischen England und Australien. **Lord's** in London ist das berühmteste Stadion.",
  "Tennis": "Tennis",
  "**Wimbledon**, held in London every summer, is the oldest tennis tournament in the world and the only Grand Slam still played on grass.":
    "**Wimbledon**, jeden Sommer in London, ist das älteste Tennisturnier der Welt und das einzige Grand-Slam-Turnier, das noch auf Rasen gespielt wird.",
  "Golf": "Golf",
  "Originated in **Scotland**. **St Andrews** is its historic home and the Open Championship is the oldest golf major.":
    "Entstand in **Schottland**. **St Andrews** ist seine historische Heimat, und die Open Championship ist das älteste Golf-Major.",
  "Horse racing": "Pferderennen",
  "Long royal associations. The **Grand National** at Aintree and **Royal Ascot** are the best-known meetings; the Derby at Epsom is the classic flat race.":
    "Seit Langem mit dem Königshaus verbunden. Das **Grand National** in Aintree und **Royal Ascot** sind die bekanntesten Veranstaltungen; das Derby in Epsom ist das klassische Flachrennen.",
  "The Olympics": "Die Olympischen Spiele",
  "London has hosted the summer Games **three times** — 1908, 1948 and **2012**. The 2012 Games also included the Paralympics, whose modern origins are British, at Stoke Mandeville.":
    "London hat die Sommerspiele **dreimal** ausgerichtet – 1908, 1948 und **2012**. Zu den Spielen 2012 gehörten auch die Paralympics, deren moderne Ursprünge im britischen Stoke Mandeville liegen.",
  "Commonwealth Games": "Commonwealth Games",
  "Held every four years between Commonwealth nations. Each UK nation competes separately, rather than as one British team.":
    "Finden alle vier Jahre zwischen den Commonwealth-Staaten statt. Jede Nation des Vereinigten Königreichs tritt einzeln an, nicht als ein britisches Team.",

  // ── 20. Literature, Art & Music ─────────────────────────────────────────
  "Writers": "Schriftsteller",
  "Art and museums": "Kunst und Museen",
  "Music": "Musik",
  "Geoffrey Chaucer": "Geoffrey Chaucer",
  "Wrote *The Canterbury Tales* in the fourteenth century — among the earliest great works in English.":
    "Schrieb im 14. Jahrhundert *The Canterbury Tales* – eines der frühesten großen Werke in englischer Sprache.",
  "William Shakespeare": "William Shakespeare",
  "Born in Stratford-upon-Avon, 1564. Plays and sonnets; the Globe Theatre in London.":
    "1564 in Stratford-upon-Avon geboren. Dramen und Sonette; das Globe Theatre in London.",
  "Jane Austen": "Jane Austen",
  "*Pride and Prejudice*, *Sense and Sensibility* — novels of English social life in the early nineteenth century.":
    "*Pride and Prejudice*, *Sense and Sensibility* – Romane über das englische Gesellschaftsleben im frühen 19. Jahrhundert.",
  "*Oliver Twist*, *A Christmas Carol*, *Great Expectations* — the poverty of Victorian Britain, read by everyone.":
    "*Oliver Twist*, *A Christmas Carol*, *Great Expectations* – die Armut im viktorianischen Großbritannien, von allen gelesen.",
  "Robert Burns": "Robert Burns",
  "Scotland's national poet, known as the Bard. Wrote *Auld Lang Syne*, sung at New Year. **Burns Night** is 25 January.":
    "Schottlands Nationaldichter, genannt der Bard. Er schrieb *Auld Lang Syne*, das an Silvester gesungen wird. Die **Burns Night** ist am 25. Januar.",
  "Others to know": "Weitere wichtige Namen",
  "The Brontë sisters, Thomas Hardy, Rudyard Kipling, Agatha Christie, J. R. R. Tolkien, George Orwell, Dylan Thomas and J. K. Rowling.":
    "Die Brontë-Schwestern, Thomas Hardy, Rudyard Kipling, Agatha Christie, J. R. R. Tolkien, George Orwell, Dylan Thomas und J. K. Rowling.",
  "Artists": "Künstler",
  "**Thomas Gainsborough** and **John Constable** for portraits and landscape, **J. M. W. Turner** for light and sea, **Henry Moore** for sculpture, **David Hockney** among the living.":
    "**Thomas Gainsborough** und **John Constable** für Porträt und Landschaft, **J. M. W. Turner** für Licht und Meer, **Henry Moore** für Skulptur, **David Hockney** unter den Lebenden.",
  "National Gallery": "National Gallery",
  "In **Trafalgar Square**, London. Holds the national collection of paintings. Free to enter.":
    "Am **Trafalgar Square** in London. Beherbergt die nationale Gemäldesammlung. Der Eintritt ist frei.",
  "British Museum": "British Museum",
  "In London, founded 1753 — the first national public museum in the world. Free to enter.":
    "In London, gegründet 1753 – das erste öffentliche Nationalmuseum der Welt. Der Eintritt ist frei.",
  "Others": "Weitere",
  "Tate Britain and Tate Modern in London, the National Museum of Scotland in Edinburgh, and the Turner Prize for contemporary art.":
    "Tate Britain und Tate Modern in London, das National Museum of Scotland in Edinburgh und der Turner Prize für zeitgenössische Kunst.",

  // ── 21. Science & Inventions ────────────────────────────────────────────
  "Scientists": "Wissenschaftler",
  "Inventors and engineers": "Erfinder und Ingenieure",
  "Other British firsts": "Weitere britische Premieren",
  "Isaac Newton": "Isaac Newton",
  "Gravity and the laws of motion. His *Principia Mathematica* is one of the most important scientific books ever written.":
    "Die Schwerkraft und die Bewegungsgesetze. Seine *Principia Mathematica* ist eines der wichtigsten wissenschaftlichen Bücher überhaupt.",
  "*On the Origin of Species*, 1859 — evolution by natural selection.":
    "*On the Origin of Species*, 1859 – Evolution durch natürliche Auslese.",
  "Alexander Fleming": "Alexander Fleming",
  "A Scot who discovered **penicillin** in 1928, the first true antibiotic.":
    "Ein Schotte, der 1928 das **Penicillin** entdeckte, das erste echte Antibiotikum.",
  "Michael Faraday": "Michael Faraday",
  "Electromagnetic induction — the principle behind the electric motor and the generator.":
    "Die elektromagnetische Induktion – das Prinzip hinter Elektromotor und Generator.",
  "Ernest Rutherford": "Ernest Rutherford",
  "Split the atom and established the structure of the atomic nucleus.":
    "Spaltete das Atom und klärte den Aufbau des Atomkerns.",
  "Rosalind Franklin": "Rosalind Franklin",
  "Her X-ray work was essential to discovering the double-helix structure of DNA, alongside Crick and Watson.":
    "Ihre Röntgenaufnahmen waren entscheidend für die Entdeckung der DNA-Doppelhelix, gemeinsam mit Crick und Watson.",
  "James Watt": "James Watt",
  "Transformed the steam engine and made industrial power practical.":
    "Verwandelte die Dampfmaschine und machte industrielle Kraft praktisch nutzbar.",
  "George Stephenson": "George Stephenson",
  "The Rocket, and the first practical passenger railways.":
    "Die Rocket und die ersten praxistauglichen Personenbahnen.",
  "Isambard Kingdom Brunel": "Isambard Kingdom Brunel",
  "The Great Western Railway, the Clifton Suspension Bridge, and pioneering steamships.":
    "Die Great Western Railway, die Clifton Suspension Bridge und wegweisende Dampfschiffe.",
  "Alexander Graham Bell": "Alexander Graham Bell",
  "Born in Edinburgh; developed the **telephone**.":
    "In Edinburgh geboren; entwickelte das **Telefon**.",
  "John Logie Baird": "John Logie Baird",
  "A Scot who gave the first public demonstration of **television**.":
    "Ein Schotte, der das **Fernsehen** erstmals öffentlich vorführte.",
  "Tim Berners-Lee": "Tim Berners-Lee",
  "Invented the **World Wide Web** in 1989 while working at CERN.":
    "Erfand 1989 am CERN das **World Wide Web**.",

  // ── 22. Famous British People ───────────────────────────────────────────
  "Monarchs": "Monarchen",
  "Political figures": "Politische Persönlichkeiten",
  "Scientists, engineers and reformers": "Wissenschaftler, Ingenieure und Reformer",
  "Writers, artists and musicians": "Schriftsteller, Künstler und Musiker",
  "Military and exploration": "Militär und Entdeckungen",
  "Won at Hastings in 1066 and became the first Norman king.":
    "Siegte 1066 bei Hastings und wurde der erste normannische König.",
  "Six wives, and the break with Rome that created the Church of England.":
    "Sechs Ehefrauen und der Bruch mit Rom, aus dem die Church of England hervorging.",
  "Reigned 45 years; the Armada was defeated in 1588.":
    "Regierte 45 Jahre; 1588 wurde die Armada besiegt.",
  "1837–1901, at the height of British industrial and imperial power.":
    "1837–1901, auf dem Höhepunkt britischer Industrie- und Weltmacht.",
  "Charles III": "Charles III.",
  "The present monarch, since September 2022.":
    "Der amtierende Monarch, seit September 2022.",
  "Oliver Cromwell": "Oliver Cromwell",
  "Led Parliament to victory in the Civil War and ruled as Lord Protector.":
    "Führte das Parlament im Bürgerkrieg zum Sieg und regierte als Lord Protector.",
  "William Wilberforce": "William Wilberforce",
  "Led the parliamentary campaign to abolish the slave trade.":
    "Führte die parlamentarische Kampagne zur Abschaffung des Sklavenhandels an.",
  "Winston Churchill": "Winston Churchill",
  "Prime Minister through the Second World War, and voted the greatest Briton in a national poll.":
    "Premierminister während des Zweiten Weltkriegs, in einer landesweiten Umfrage zum größten Briten gewählt.",
  "Clement Attlee": "Clement Attlee",
  "Prime Minister from 1945; his government built the welfare state and the NHS.":
    "Premierminister ab 1945; seine Regierung schuf den Sozialstaat und den NHS.",
  "Margaret Thatcher": "Margaret Thatcher",
  "The first woman Prime Minister, from 1979 to 1990.":
    "Die erste Premierministerin, von 1979 bis 1990.",
  "Led the suffragette campaign for votes for women.":
    "Führte die Suffragetten-Kampagne für das Frauenwahlrecht an.",
  "Gravity and the laws of motion.": "Die Schwerkraft und die Bewegungsgesetze.",
  "Evolution by natural selection.": "Evolution durch natürliche Auslese.",
  "Penicillin, 1928.": "Das Penicillin, 1928.",
  "Railways, bridges and steamships.": "Eisenbahnen, Brücken und Dampfschiffe.",
  "Founded modern nursing.": "Begründete die moderne Krankenpflege.",
  "Alan Turing": "Alan Turing",
  "Computing, and the codebreakers at Bletchley Park.":
    "Die Informatik und die Codeknacker von Bletchley Park.",
  "The most influential writer in the English language.":
    "Der einflussreichste Autor der englischen Sprache.",
  "Jane Austen and Charles Dickens": "Jane Austen und Charles Dickens",
  "The two most widely read English novelists of the nineteenth century.":
    "Die beiden meistgelesenen englischen Romanciers des 19. Jahrhunderts.",
  "Scotland's national poet.": "Schottlands Nationaldichter.",
  "J. M. W. Turner": "J. M. W. Turner",
  "Landscape and seascape painter; the Turner Prize is named after him.":
    "Maler von Landschaften und Seestücken; der Turner Prize ist nach ihm benannt.",
  "The Beatles": "The Beatles",
  "From Liverpool — the most successful British band.":
    "Aus Liverpool – die erfolgreichste britische Band.",
  "Sake Dean Mahomet": "Sake Dean Mahomet",
  "Opened Britain's first Indian restaurant and introduced shampooing; an early figure in Britain's multicultural history.":
    "Eröffnete Großbritanniens erstes indisches Restaurant und führte das Haarewaschen ein; eine frühe Figur der multikulturellen Geschichte des Landes.",

  // ── 23. Education & Healthcare ──────────────────────────────────────────
  "Education": "Bildung",
  "The NHS": "Der NHS",
  "Emergency services": "Rettungsdienste",
  "Primary school": "Grundschule",
  "From about age 5 to 11. One class teacher covers most subjects.":
    "Etwa vom 5. bis zum 11. Lebensjahr. Eine Klassenlehrkraft unterrichtet die meisten Fächer.",
  "Secondary school": "Weiterführende Schule",
  "From about 11 to 16, ending with **GCSEs** in England, Wales and Northern Ireland, or **National Qualifications** in Scotland.":
    "Etwa von 11 bis 16 Jahren, abgeschlossen mit den **GCSEs** in England, Wales und Nordirland oder den **National Qualifications** in Schottland.",
  "Further education": "Weiterführende Bildung",
  "**A levels**, or Highers in Scotland, and vocational courses at sixth form or college, usually 16 to 18.":
    "**A levels**, in Schottland Highers, sowie berufsbildende Kurse an der Sixth Form oder am College, meist von 16 bis 18.",
  "Higher education": "Hochschulbildung",
  "Universities award degrees. **Oxford** and **Cambridge** are the oldest. Tuition fees and support differ between the four nations, because education is devolved.":
    "Universitäten verleihen Abschlüsse. **Oxford** und **Cambridge** sind die ältesten. Studiengebühren und Förderung unterscheiden sich zwischen den vier Nationen, weil Bildung dezentral geregelt ist.",
  "Your GP": "Deine Hausarztpraxis",
  "A **general practitioner** is your first point of contact. Register with a local practice; you need to be registered to be referred for most other care.":
    "Eine **general practitioner** ist deine erste Anlaufstelle. Melde dich bei einer Praxis vor Ort an; ohne Anmeldung gibt es für die meisten weiteren Behandlungen keine Überweisung.",
  "Hospitals": "Krankenhäuser",
  "You normally attend after a GP referral, except in an emergency.":
    "Normalerweise gehst du nach einer Überweisung durch die Hausarztpraxis hin – außer im Notfall.",
  "Prescriptions": "Rezepte",
  "Charged in England, with many exemptions. Free in Scotland, Wales and Northern Ireland.":
    "In England kostenpflichtig, mit vielen Ausnahmen. In Schottland, Wales und Nordirland kostenlos.",
  "Dentists and opticians": "Zahnärzte und Optiker",
  "NHS treatment is available but usually carries a charge.":
    "NHS-Behandlung ist möglich, meist aber gegen Gebühr.",

  // ── Lernbereich-Überschriften, in jeder Lektion gleich ──────────────────
  "What you must know": "Das musst du wissen",
  "Key names": "Wichtige Namen",
  "Key dates and numbers": "Wichtige Jahreszahlen und Zahlen",
  "Key terms": "Wichtige Begriffe",

  // ── 1. British Values & Principles: Fließtext ───────────────────────────
  "Why this lesson first: the test does not only ask facts. Several questions ask what British society expects of you, and those answers come straight from the values below.":
    "Warum diese Lektion zuerst kommt: Der Test fragt nicht nur Fakten ab. Mehrere Fragen zielen darauf, was die britische Gesellschaft von dir erwartet – und diese Antworten stehen direkt in den Werten unten.",
  "The UK sets out a short list of shared values. Learn them as a list — questions often ask you to pick which one is *not* included.":
    "Das Vereinigte Königreich benennt eine kurze Liste gemeinsamer Werte. Lerne sie als Liste – oft wird gefragt, welcher Punkt *nicht* dazugehört.",
  "It is unlawful to discriminate against someone on any of these grounds: **age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, and sexual orientation**.":
    "Diskriminierung aus einem dieser Gründe ist rechtswidrig: **Alter, Behinderung, Geschlechtsangleichung, Ehe und eingetragene Partnerschaft, Schwangerschaft und Mutterschaft, ethnische Herkunft, Religion oder Weltanschauung, Geschlecht und sexuelle Orientierung**.",
  "The values cut both ways. Living in the UK gives you rights, and each one carries a matching duty.":
    "Die Werte gelten in beide Richtungen. Das Leben im Vereinigten Königreich gibt dir Rechte, und zu jedem gehört eine passende Pflicht.",
  "Freedom of speech is not unlimited. Speech that incites violence or racial hatred is a criminal offence. The test does ask about that boundary.":
    "Die Meinungsfreiheit ist nicht grenzenlos. Äußerungen, die zu Gewalt oder Rassenhass aufstacheln, sind eine Straftat. Nach dieser Grenze wird im Test tatsächlich gefragt.",
  "No people to learn here — this lesson is about principles, not personalities.":
    "Hier gibt es keine Personen zu lernen – in dieser Lektion geht es um Prinzipien, nicht um Persönlichkeiten.",

  // ── 2. The UK & Geography: Fließtext ────────────────────────────────────
  "This trips people up constantly, and the test knows it. **The United Kingdom** is England, Scotland, Wales and Northern Ireland. **Great Britain** is only England, Scotland and Wales — it is the island, so Northern Ireland is not part of it.":
    "Daran scheitern ständig Leute, und der Test weiß das. **Das Vereinigte Königreich** besteht aus England, Schottland, Wales und Nordirland. **Großbritannien** umfasst nur England, Schottland und Wales – es ist die Insel, Nordirland gehört also nicht dazu.",
  "The Channel Islands and the Isle of Man are Crown Dependencies. They are NOT part of the UK. They have their own governments and are linked to the Crown, not to Parliament in Westminster.":
    "Die Kanalinseln und die Isle of Man sind Crown Dependencies. Sie gehören NICHT zum Vereinigten Königreich. Sie haben eigene Regierungen und sind mit der Krone verbunden, nicht mit dem Parlament in Westminster.",
  "England is divided into **counties** — Kent, Yorkshire, Cornwall, Devon, Lancashire and dozens more — and into broader regions such as the **South East, the Midlands, the North West and East Anglia**. Scotland has council areas and historic regions such as the **Highlands, the Lowlands and the Borders**. Northern Ireland has six counties: Antrim, Armagh, Down, Fermanagh, Londonderry and Tyrone.":
    "England ist in **Grafschaften (counties)** gegliedert – Kent, Yorkshire, Cornwall, Devon, Lancashire und Dutzende mehr – sowie in größere Regionen wie **South East, Midlands, North West und East Anglia**. Schottland hat Verwaltungsbezirke und historische Regionen wie die **Highlands, die Lowlands und die Borders**. Nordirland hat sechs Grafschaften: Antrim, Armagh, Down, Fermanagh, Londonderry und Tyrone.",
  "**Lough Neagh** in Northern Ireland is the largest freshwater lake in the whole UK by area. **Loch Ness** and **Loch Lomond** are the best-known Scottish lochs — Loch Lomond is the largest by surface area in Great Britain, while Loch Ness holds the most water. **Windermere** in the Lake District is the largest lake in England.":
    "**Lough Neagh** in Nordirland ist der flächenmäßig größte Süßwassersee im gesamten Vereinigten Königreich. **Loch Ness** und **Loch Lomond** sind die bekanntesten schottischen Lochs – Loch Lomond ist der flächengrößte in Großbritannien, Loch Ness enthält das meiste Wasser. **Windermere** im Lake District ist der größte See Englands.",
  "There are **15 National Parks** across the UK. The best known are the **Lake District, Snowdonia (Eryri), the Peak District, the Yorkshire Dales, Dartmoor, the Cairngorms** and **Loch Lomond and the Trossachs**. Landmarks the test may mention include **Stonehenge**, **Hadrian's Wall**, the **Giant's Causeway** in County Antrim, the **Tower of London**, **Edinburgh Castle** and the **Lake District**.":
    "Im Vereinigten Königreich gibt es **15 Nationalparks**. Die bekanntesten sind der **Lake District, Snowdonia (Eryri), der Peak District, die Yorkshire Dales, Dartmoor, die Cairngorms** und **Loch Lomond and the Trossachs**. Wahrzeichen, die im Test vorkommen können: **Stonehenge**, der **Hadrianswall**, der **Giant's Causeway** in der Grafschaft Antrim, der **Tower of London**, **Edinburgh Castle** und der **Lake District**.",
  "English is spoken throughout. **Welsh** is an official language in Wales and is taught in schools there. **Gaelic** is spoken in parts of Scotland, and **Irish** is spoken in Northern Ireland. Scots and Ulster Scots are also recognised.":
    "Englisch wird überall gesprochen. **Walisisch** ist in Wales Amtssprache und wird dort in der Schule unterrichtet. **Gälisch** spricht man in Teilen Schottlands, **Irisch** in Nordirland. Auch Scots und Ulster Scots sind anerkannt.",
  "In one line: Great Britain is the island — three nations. The UK is four. The Isle of Man and the Channel Islands are in neither.":
    "In einem Satz: Großbritannien ist die Insel – drei Nationen. Das Vereinigte Königreich hat vier. Die Isle of Man und die Kanalinseln gehören zu keinem von beiden.",

  // ── 3. National Identity & Symbols: Fließtext ───────────────────────────
  "Every nation of the UK carries its own saint, flower, flag and symbol — and the Union brings three of the four together in one flag. The test asks which belongs to which, so learn them as four sets rather than as one long list.":
    "Jede Nation des Vereinigten Königreichs hat ihren eigenen Heiligen, ihre Blume, Flagge und ihr Symbol – und die Union vereint drei der vier in einer Flagge. Im Test wird gefragt, was wozu gehört: Lerne sie deshalb als vier Sets statt als eine lange Liste.",
  "The **Union Flag** — often called the **Union Jack** — combines three crosses: the red cross of **St George** on white for England, the white diagonal cross (saltire) of **St Andrew** on blue for Scotland, and the red diagonal cross of **St Patrick** on white for Ireland.":
    "Die **Union Flag** – oft **Union Jack** genannt – vereint drei Kreuze: das rote Kreuz des **St George** auf Weiß für England, das weiße Schrägkreuz (saltire) des **St Andrew** auf Blau für Schottland und das rote Schrägkreuz des **St Patrick** auf Weiß für Irland.",
  "Why Wales is missing: when the first Union Flag was designed in 1606, Wales had already been joined to England, so it was not treated as a separate kingdom. The Welsh dragon flies on its own flag instead.":
    "Warum Wales fehlt: Als die erste Union Flag 1606 entworfen wurde, war Wales bereits mit England vereinigt und galt daher nicht als eigenes Königreich. Der walisische Drache fliegt stattdessen auf einer eigenen Flagge.",
  "Four saints, four dates. Two fall in March, and that is the pair people mix up.":
    "Vier Heilige, vier Daten. Zwei fallen in den März – und genau dieses Paar wird verwechselt.",
  "England.": "England.",
  "The **Welsh Dragon** appears on the flag of Wales. The **lion** and the **unicorn** support the Royal Coat of Arms — the lion for England, the unicorn for Scotland. The **oak tree** is a long-standing English symbol, and the **poppy** is worn nationally for Remembrance.":
    "Der **walisische Drache** erscheint auf der Flagge von Wales. **Löwe** und **Einhorn** tragen das königliche Wappen – der Löwe für England, das Einhorn für Schottland. Die **Eiche** ist ein altes englisches Symbol, und die **Mohnblume** wird landesweit zum Gedenken getragen.",
  "The national anthem of the UK is **God Save the King** (God Save the Queen during a queen's reign). It is played at state occasions and when the monarch appears in public. In sport each nation may use its own song — **Flower of Scotland** for Scotland, **Hen Wlad Fy Nhadau (Land of My Fathers)** for Wales, and **Jerusalem** or the national anthem for England.":
    "Die Nationalhymne des Vereinigten Königreichs ist **God Save the King** (God Save the Queen, wenn eine Königin regiert). Sie wird bei Staatsanlässen gespielt und wenn der Monarch öffentlich auftritt. Im Sport nutzt jede Nation ihr eigenes Lied – **Flower of Scotland** für Schottland, **Hen Wlad Fy Nhadau (Land of My Fathers)** für Wales und **Jerusalem** oder die Nationalhymne für England.",
  "Why the words change: they follow the monarch's gender, not the country. Nothing else in the song changes.":
    "Warum sich der Text ändert: Er richtet sich nach dem Geschlecht des Monarchen, nicht nach dem Land. Sonst ändert sich am Lied nichts.",
  "In one line: Four saints, four flowers, four dates — and only three crosses in the flag, because Wales was already joined to England.":
    "In einem Satz: Vier Heilige, vier Blumen, vier Daten – und nur drei Kreuze in der Flagge, weil Wales schon mit England vereinigt war.",

  // ── 4. Early British History: Fließtext ─────────────────────────────────
  "For most of prehistory Britain was not an island. It was joined to the continent by land, and people walked here. Around **10,000 years ago** the land bridge flooded and Britain was cut off.":
    "Den größten Teil der Vorgeschichte über war Britannien keine Insel. Es war über Land mit dem Kontinent verbunden, und die Menschen kamen zu Fuß. Vor rund **10.000 Jahren** wurde die Landbrücke überflutet und Britannien abgeschnitten.",
  "The **Celts** spoke languages from which modern **Welsh, Gaelic and Irish** descend. **Stonehenge** in Wiltshire is the most famous prehistoric monument in Britain and is still a World Heritage Site.":
    "Die **Kelten** sprachen Sprachen, von denen das heutige **Walisisch, Gälisch und Irisch** abstammen. **Stonehenge** in Wiltshire ist das berühmteste vorgeschichtliche Denkmal Britanniens und bis heute Weltkulturerbe.",
  "**Julius Caesar** led an expedition in **55 BC** and it failed — he did not conquer Britain. The successful invasion came almost a century later, under the Emperor **Claudius in AD 43**.":
    "**Julius Caesar** führte **55 v. Chr.** einen Feldzug – und er scheiterte: Er eroberte Britannien nicht. Die erfolgreiche Invasion kam fast ein Jahrhundert später unter Kaiser **Claudius im Jahr 43 n. Chr.**",
  "55 BC and AD 43 are the pair the test loves. Caesar came and left; Claudius came and stayed. Do not swap them.":
    "55 v. Chr. und 43 n. Chr. sind das Lieblingspaar des Tests. Caesar kam und ging; Claudius kam und blieb. Verwechsle sie nicht.",
  "**Boudicca**, queen of the Iceni in what is now East Anglia, led a famous revolt against Roman rule. Her statue stands on Westminster Bridge in London. The Romans never conquered what is now Scotland, and the Emperor **Hadrian** built **Hadrian's Wall** across the north of England to keep out the tribes he called the Picts. The Romans left Britain in **AD 410** to defend Rome itself.":
    "**Boudicca**, Königin der Icener im heutigen East Anglia, führte einen berühmten Aufstand gegen die römische Herrschaft an. Ihre Statue steht auf der Westminster Bridge in London. Das heutige Schottland eroberten die Römer nie, und Kaiser **Hadrian** ließ quer durch Nordengland den **Hadrianswall** errichten, um die Stämme fernzuhalten, die er Pikten nannte. **410 n. Chr.** verließen die Römer Britannien, um Rom selbst zu verteidigen.",
  "After the Romans left, tribes from northern Europe — the **Angles, Saxons and Jutes** — settled in Britain. Their language became the basis of modern English, and the country took its name from the Angles: *Angle-land*, England. The burial ship at **Sutton Hoo** in Suffolk dates from this period.":
    "Nach dem Abzug der Römer siedelten Stämme aus Nordeuropa – die **Angeln, Sachsen und Jüten** – in Britannien. Ihre Sprache wurde zur Grundlage des heutigen Englisch, und das Land erhielt seinen Namen von den Angeln: *Angle-land*, England. Das Grabschiff von **Sutton Hoo** in Suffolk stammt aus dieser Zeit.",
  "Christian missionaries arrived to convert the Anglo-Saxons — **St Augustine** in the south, who became the first Archbishop of Canterbury, and **St Columba** in Scotland, who founded a monastery on **Iona**.":
    "Christliche Missionare kamen, um die Angelsachsen zu bekehren – **St Augustine** im Süden, der erster Archbishop of Canterbury wurde, und **St Columba** in Schottland, der auf **Iona** ein Kloster gründete.",
  "Vikings from Denmark and Norway first raided in **AD 789** and later settled. **Alfred the Great**, King of Wessex, defeated them and agreed a boundary: the north and east of England became the **Danelaw**, under Danish law, while Wessex remained English.":
    "Wikinger aus Dänemark und Norwegen überfielen das Land erstmals **789 n. Chr.** und siedelten später. **Alfred der Große**, König von Wessex, besiegte sie und vereinbarte eine Grenze: Der Norden und Osten Englands wurde zum **Danelaw** unter dänischem Recht, während Wessex englisch blieb.",
  "In **1066** **William, Duke of Normandy**, defeated King Harold at the **Battle of Hastings** and became William I — William the Conqueror. It is the last time Britain was successfully invaded, and the date every schoolchild in Britain knows.":
    "**1066** besiegte **Wilhelm, Herzog der Normandie**, König Harold in der **Schlacht von Hastings** und wurde Wilhelm I. – Wilhelm der Eroberer. Es ist das letzte Mal, dass Britannien erfolgreich erobert wurde, und das Datum, das jedes britische Schulkind kennt.",
  "In one line: Caesar came and left in 55 BC; Claudius came and stayed in AD 43. That pair is the trap this chapter is built around.":
    "In einem Satz: Caesar kam und ging 55 v. Chr.; Claudius kam und blieb 43 n. Chr. Um dieses Paar herum ist dieses Kapitel gebaut.",

  // ── 5. Medieval Britain: Fließtext ──────────────────────────────────────
  "The Middle Ages run from the Norman Conquest to the Tudors. Two themes carry most of the test questions: the slow limiting of the king's power, and the long wars with Wales, Scotland and France.":
    "Das Mittelalter reicht von der normannischen Eroberung bis zu den Tudors. Zwei Themen tragen die meisten Testfragen: die allmähliche Beschränkung der Königsmacht und die langen Kriege mit Wales, Schottland und Frankreich.",
  "**King John** was forced by his barons to agree to **Magna Carta** — the Great Charter — in **1215** at Runnymede. It established that the king was **not above the law** and could not tax as he pleased. It is the foundation of the rule of law in Britain.":
    "**König Johann** wurde **1215** in Runnymede von seinen Baronen gezwungen, der **Magna Carta** – der Großen Urkunde – zuzustimmen. Sie hielt fest, dass der König **nicht über dem Gesetz steht** und nicht nach Belieben Steuern erheben darf. Sie ist die Grundlage der Rechtsstaatlichkeit in Großbritannien.",
  "Why Magna Carta still matters: it is the first written statement that a ruler is bound by law. The principle behind it is one of the fundamental values you learned in lesson 1.":
    "Warum die Magna Carta bis heute zählt: Sie ist die erste schriftliche Festlegung, dass ein Herrscher an das Recht gebunden ist. Das dahinterstehende Prinzip ist einer der Grundwerte aus Lektion 1.",
  "**Henry II** reformed the courts and quarrelled with **Thomas Becket**, Archbishop of Canterbury, who was murdered in Canterbury Cathedral in 1170. **Richard I**, the Lionheart, spent almost his whole reign abroad on crusade.":
    "**Heinrich II.** reformierte die Gerichte und stritt mit **Thomas Becket**, dem Archbishop of Canterbury, der 1170 in der Kathedrale von Canterbury ermordet wurde. **Richard I.**, Löwenherz, verbrachte fast seine gesamte Regierungszeit auf Kreuzzügen im Ausland.",
  "**Edward I** conquered **Wales** and built a ring of castles there; the **Statute of Rhuddlan (1284)** annexed Wales to the English Crown. He tried the same in **Scotland** and failed.":
    "**Eduard I.** eroberte **Wales** und ließ dort einen Ring von Burgen errichten; das **Statute of Rhuddlan (1284)** gliederte Wales der englischen Krone an. In **Schottland** versuchte er dasselbe und scheiterte.",
  "England and France fought on and off from **1337 to 1453**. The English won famous victories at **Crécy (1346)** and **Agincourt (1415)** under **Henry V**, but by the end had lost all their French lands except Calais.":
    "England und Frankreich kämpften mit Unterbrechungen von **1337 bis 1453**. Die Engländer errangen berühmte Siege bei **Crécy (1346)** und **Azincourt (1415)** unter **Heinrich V.**, verloren am Ende aber alle französischen Besitzungen außer Calais.",
  "The **Black Death** reached Britain in **1348** and killed roughly a third of the population. So few labourers were left that survivors could demand better pay — the feudal system began to break down. When a poll tax was imposed, the **Peasants Revolt of 1381** broke out, led by **Wat Tyler**.":
    "Der **Schwarze Tod** erreichte Britannien **1348** und tötete etwa ein Drittel der Bevölkerung. Es blieben so wenige Arbeitskräfte, dass die Überlebenden bessere Bezahlung fordern konnten – das Feudalsystem begann zu zerfallen. Als eine Kopfsteuer erhoben wurde, brach **1381 der Bauernaufstand** unter **Wat Tyler** aus.",
  "A civil war between the **House of Lancaster** (red rose) and the **House of York** (white rose), ending at the **Battle of Bosworth Field in 1485**. Richard III was killed, Henry Tudor won, and the **Tudor rose** — red and white together — was the emblem of the peace that followed.":
    "Ein Bürgerkrieg zwischen dem **Haus Lancaster** (rote Rose) und dem **Haus York** (weiße Rose), der **1485 in der Schlacht von Bosworth Field** endete. Richard III. fiel, Heinrich Tudor siegte, und die **Tudor-Rose** – Rot und Weiß zusammen – wurde zum Sinnbild des folgenden Friedens.",
  "William the Conqueror · Henry II · Thomas Becket · Richard I · King John · Edward I · William Wallace · Robert the Bruce · Henry V · Wat Tyler.":
    "Wilhelm der Eroberer · Heinrich II. · Thomas Becket · Richard I. · König Johann · Eduard I. · William Wallace · Robert the Bruce · Heinrich V. · Wat Tyler.",
  "1066 Hastings · 1086 Domesday Book · 1215 Magna Carta · 1284 Statute of Rhuddlan · 1314 Bannockburn · 1337–1453 Hundred Years War · 1348 Black Death · 1381 Peasants' Revolt · 1415 Agincourt · 1485 Bosworth Field.":
    "1066 Hastings · 1086 Domesday Book · 1215 Magna Carta · 1284 Statute of Rhuddlan · 1314 Bannockburn · 1337–1453 Hundertjähriger Krieg · 1348 Schwarzer Tod · 1381 Bauernaufstand · 1415 Azincourt · 1485 Bosworth Field.",
  "Feudal system · Magna Carta · Domesday Book · Wars of the Roses · poll tax · barons.":
    "Feudalsystem · Magna Carta · Domesday Book · Rosenkriege · Kopfsteuer · Barone.",
  "In one line: Magna Carta in 1215 is the first written statement that a ruler is bound by law — the root of the rule of law you learned in lesson 1.":
    "In einem Satz: Die Magna Carta von 1215 ist die erste schriftliche Festlegung, dass ein Herrscher an das Recht gebunden ist – die Wurzel der Rechtsstaatlichkeit aus Lektion 1.",

  // ── 6. The Tudors: Fließtext ────────────────────────────────────────────
  "Five Tudor monarchs in 118 years, and between them they broke with Rome, changed the country's religion three times, and turned England into a naval power.":
    "Fünf Tudor-Monarchen in 118 Jahren – zusammen brachen sie mit Rom, änderten dreimal die Religion des Landes und machten England zur Seemacht.",
  "**Henry VII** ended the Wars of the Roses and founded the dynasty. His son **Henry VIII** is remembered for his **six wives** and for breaking with the Pope.":
    "**Heinrich VII.** beendete die Rosenkriege und begründete die Dynastie. Sein Sohn **Heinrich VIII.** ist für seine **sechs Ehefrauen** und den Bruch mit dem Papst bekannt.",
  "The rhyme British children learn: divorced, beheaded, died; divorced, beheaded, survived. It is the fastest way to keep the six in order.":
    "Der Merkspruch britischer Kinder: geschieden, enthauptet, gestorben; geschieden, enthauptet, überlebt. Das ist der schnellste Weg, die sechs in der richtigen Reihenfolge zu behalten.",
  "When the Pope refused to annul his first marriage, Henry VIII broke with Rome and made himself **Head of the Church of England**. The **Dissolution of the Monasteries** followed: monasteries were closed and their wealth taken by the Crown. Wales was formally united with England by law during his reign.":
    "Als der Papst sich weigerte, seine erste Ehe zu annullieren, brach Heinrich VIII. mit Rom und machte sich selbst zum **Oberhaupt der Church of England**. Es folgte die **Dissolution of the Monasteries**: Klöster wurden geschlossen und ihr Vermögen von der Krone eingezogen. In seiner Regierungszeit wurde Wales per Gesetz förmlich mit England vereinigt.",
  "In **1588** Catholic Spain sent a great fleet, the **Armada**, to invade England. It was defeated by the English navy and scattered by storms. The victory made Elizabeth's reputation and established England as a serious naval power.":
    "**1588** schickte das katholische Spanien eine große Flotte, die **Armada**, um England zu erobern. Sie wurde von der englischen Marine besiegt und von Stürmen zerstreut. Der Sieg begründete Elisabeths Ruf und machte England zu einer ernstzunehmenden Seemacht.",
  "**William Shakespeare (1564–1616)** was born in **Stratford-upon-Avon**. He wrote plays and poetry, worked at the **Globe Theatre** in London, and shaped the English language more than any other writer. Famous works include *Hamlet*, *Macbeth*, *Romeo and Juliet* and *A Midsummer Night's Dream*.":
    "**William Shakespeare (1564–1616)** wurde in **Stratford-upon-Avon** geboren. Er schrieb Dramen und Gedichte, wirkte am **Globe Theatre** in London und prägte die englische Sprache stärker als jeder andere Autor. Bekannte Werke sind *Hamlet*, *Macbeth*, *Romeo and Juliet* und *A Midsummer Night's Dream*.",
  "Also in this period: **Mary, Queen of Scots**, a Catholic cousin of Elizabeth, fled to England, was imprisoned for years and eventually executed in 1587. Her son became James VI of Scotland — and then James I of England.":
    "Ebenfalls in dieser Zeit: **Maria Stuart**, eine katholische Cousine Elisabeths, floh nach England, war jahrelang gefangen und wurde 1587 hingerichtet. Ihr Sohn wurde Jakob VI. von Schottland – und später Jakob I. von England.",
  "Henry VII · Henry VIII · his six wives · Edward VI · Mary I · Elizabeth I · Mary, Queen of Scots · William Shakespeare.":
    "Heinrich VII. · Heinrich VIII. · seine sechs Ehefrauen · Eduard VI. · Maria I. · Elisabeth I. · Maria Stuart · William Shakespeare.",
  "1485 Tudors begin · 1534 break with Rome · 1587 Mary, Queen of Scots executed · 1588 Spanish Armada · 1564–1616 Shakespeare.":
    "1485 Beginn der Tudors · 1534 Bruch mit Rom · 1587 Hinrichtung Maria Stuarts · 1588 Spanische Armada · 1564–1616 Shakespeare.",
  "Reformation · Church of England · Dissolution of the Monasteries · annulment · Armada · the Globe Theatre.":
    "Reformation · Church of England · Dissolution of the Monasteries · Annullierung · Armada · das Globe Theatre.",
  "In one line: Divorced, beheaded, died; divorced, beheaded, survived. The break with Rome started as a marriage dispute, not a change of belief.":
    "In einem Satz: Geschieden, enthauptet, gestorben; geschieden, enthauptet, überlebt. Der Bruch mit Rom begann als Ehestreit, nicht als Glaubenswechsel.",

  // ── 7. Stuarts & Civil War: Fließtext ───────────────────────────────────
  "The seventeenth century is where Parliament wins. A king is executed, a republic is tried and abandoned, and by 1689 it is settled law that the Crown rules with Parliament, not over it.":
    "Im 17. Jahrhundert setzt sich das Parlament durch. Ein König wird hingerichtet, eine Republik wird erprobt und aufgegeben, und ab 1689 gilt als geltendes Recht: Die Krone regiert mit dem Parlament, nicht über es.",
  "When Elizabeth I died childless in 1603, **James VI of Scotland** became **James I of England** — the same man wearing two crowns, though the countries stayed separate. He ordered the **King James Bible**, still the best-known English translation.":
    "Als Elisabeth I. 1603 kinderlos starb, wurde **Jakob VI. von Schottland** zu **Jakob I. von England** – derselbe Mann mit zwei Kronen, während die Länder getrennt blieben. Er gab die **King James Bible** in Auftrag, bis heute die bekannteste englische Übersetzung.",
  "In **1605** a group of Catholics led by **Guy Fawkes** tried to blow up Parliament and the King. The **Gunpowder Plot** failed, and the country still marks it on **5 November** with bonfires and fireworks.":
    "**1605** versuchte eine Gruppe von Katholiken unter **Guy Fawkes**, das Parlament und den König in die Luft zu sprengen. Das **Schießpulver-Attentat** scheiterte, und das Land erinnert bis heute am **5. November** mit Feuern und Feuerwerk daran.",
  "**Charles I** believed in the **divine right of kings** — that his authority came from God and Parliament could not limit it. He ruled for eleven years without calling Parliament at all. The quarrel became war in **1642**.":
    "**Karl I.** glaubte an das **Gottesgnadentum** – dass seine Macht von Gott komme und das Parlament sie nicht beschränken könne. Elf Jahre lang regierte er, ohne das Parlament überhaupt einzuberufen. **1642** wurde aus dem Streit ein Krieg.",
  "England became a republic, the **Commonwealth**, with **Oliver Cromwell** as **Lord Protector**. His rule was strict and puritan — theatres closed, Christmas celebrations discouraged. He also campaigned brutally in Ireland. When he died his son could not hold the country together.":
    "England wurde zur Republik, dem **Commonwealth**, mit **Oliver Cromwell** als **Lord Protector**. Seine Herrschaft war streng und puritanisch – Theater wurden geschlossen, Weihnachtsfeiern missbilligt. In Irland führte er zudem brutale Feldzüge. Nach seinem Tod konnte sein Sohn das Land nicht zusammenhalten.",
  "In **1660** Parliament invited **Charles II** back to the throne — the **Restoration**. His reign saw the **Great Plague of 1665** and the **Great Fire of London in 1666**, and the founding of the **Royal Society**, Britain's oldest scientific institution.":
    "**1660** rief das Parlament **Karl II.** auf den Thron zurück – die **Restauration**. In seine Zeit fallen die **große Pest von 1665**, der **Große Brand von London 1666** und die Gründung der **Royal Society**, der ältesten wissenschaftlichen Institution Großbritanniens.",
  "**James II** was Catholic, and Protestant leaders feared where he would take the country. They invited his Protestant daughter **Mary** and her Dutch husband **William of Orange** to take the throne. William landed in 1688 and James fled without a battle — hence **Glorious Revolution**, a revolution with almost no bloodshed in England.":
    "**Jakob II.** war Katholik, und protestantische Führer fürchteten, wohin er das Land bringen würde. Sie luden seine protestantische Tochter **Maria** und deren niederländischen Mann **Wilhelm von Oranien** auf den Thron. Wilhelm landete 1688, und Jakob floh ohne Schlacht – daher **Glorious Revolution**, eine Revolution fast ohne Blutvergießen in England.",
  "**William III and Mary II** ruled jointly. In **1689** the **Bill of Rights** settled the terms: the monarch may not raise taxes or keep an army without Parliament, Parliament must meet regularly, and elections must be free.":
    "**Wilhelm III. und Maria II.** regierten gemeinsam. **1689** legte die **Bill of Rights** die Bedingungen fest: Der Monarch darf ohne Parlament weder Steuern erheben noch ein Heer unterhalten, das Parlament muss regelmäßig zusammentreten, und Wahlen müssen frei sein.",
  "Why 1689 is the hinge: everything after it is a constitutional monarchy. The monarch reigns, Parliament governs — the arrangement Britain still has.":
    "Warum 1689 der Wendepunkt ist: Alles danach ist eine konstitutionelle Monarchie. Der Monarch herrscht repräsentativ, das Parlament regiert – so ist es bis heute.",
  "James I · Guy Fawkes · Charles I · Oliver Cromwell · Charles II · James II · William III · Mary II.":
    "Jakob I. · Guy Fawkes · Karl I. · Oliver Cromwell · Karl II. · Jakob II. · Wilhelm III. · Maria II.",
  "1603 James I · 1605 Gunpowder Plot · 1642–1651 Civil War · 1649 Charles I executed · 1660 Restoration · 1665 Plague · 1666 Great Fire · 1688 Glorious Revolution · 1689 Bill of Rights.":
    "1603 Jakob I. · 1605 Schießpulver-Attentat · 1642–1651 Bürgerkrieg · 1649 Hinrichtung Karls I. · 1660 Restauration · 1665 Pest · 1666 Großer Brand · 1688 Glorious Revolution · 1689 Bill of Rights.",
  "Divine right of kings · Cavaliers · Roundheads · Commonwealth · Lord Protector · Restoration · Bill of Rights.":
    "Gottesgnadentum · Cavaliers · Roundheads · Commonwealth · Lord Protector · Restauration · Bill of Rights.",
  "In one line: 1689 is the hinge: after the Bill of Rights the monarch reigns and Parliament governs. Everything since is a constitutional monarchy.":
    "In einem Satz: 1689 ist der Wendepunkt – nach der Bill of Rights herrscht der Monarch repräsentativ und das Parlament regiert. Seither ist es eine konstitutionelle Monarchie.",

  // ── 8. Britain 1700–1900: Fließtext ─────────────────────────────────────
  "Two centuries in which Britain becomes one kingdom, then the first industrial nation, then the largest empire in history — and in which a long argument about slavery and about the vote begins to be won.":
    "Zwei Jahrhunderte, in denen Großbritannien erst ein Königreich, dann die erste Industrienation und schließlich das größte Weltreich der Geschichte wird – und in denen ein langer Streit über Sklaverei und über das Wahlrecht allmählich gewonnen wird.",
  "The **Act of Union in 1707** joined the parliaments of England and Scotland into the **Kingdom of Great Britain**, governed from Westminster. A second **Act of Union in 1801** added Ireland, creating the United Kingdom.":
    "Der **Act of Union von 1707** vereinte die Parlamente Englands und Schottlands zum **Königreich Großbritannien**, regiert von Westminster aus. Ein zweiter **Act of Union 1801** fügte Irland hinzu und schuf das Vereinigte Königreich.",
  "The **Jacobites** wanted the Stuart line restored. **Bonnie Prince Charlie** — Charles Edward Stuart — landed in Scotland in 1745, raised an army, and was crushed at the **Battle of Culloden in 1746**, the last battle fought on British soil.":
    "Die **Jakobiten** wollten die Stuart-Linie zurück auf den Thron. **Bonnie Prince Charlie** – Charles Edward Stuart – landete 1745 in Schottland, stellte ein Heer auf und wurde **1746 in der Schlacht von Culloden** vernichtend geschlagen, der letzten Schlacht auf britischem Boden.",
  "Britain was the first country to industrialise. Machines replaced hand tools, factories replaced workshops, and people moved from the countryside into fast-growing cities such as Manchester, Birmingham and Glasgow.":
    "Großbritannien industrialisierte sich als erstes Land. Maschinen ersetzten Handwerkzeug, Fabriken ersetzten Werkstätten, und die Menschen zogen vom Land in rasch wachsende Städte wie Manchester, Birmingham und Glasgow.",
  "The **British Empire** grew until it covered around a quarter of the world. Its wealth came partly from the **slave trade**, in which British ships carried enslaved Africans to the colonies.":
    "Das **British Empire** wuchs, bis es rund ein Viertel der Welt umfasste. Sein Reichtum stammte zum Teil aus dem **Sklavenhandel**, bei dem britische Schiffe versklavte Afrikaner in die Kolonien brachten.",
  "Two dates, often confused. **1807** abolished the slave TRADE — carrying and selling. **1833** abolished SLAVERY itself throughout the Empire. The Abolition Act freed those already enslaved.":
    "Zwei Daten, die oft verwechselt werden. **1807** wurde der SKLAVENHANDEL abgeschafft – Transport und Verkauf. **1833** wurde die SKLAVEREI selbst im gesamten Empire abgeschafft. Der Abolition Act befreite die bereits Versklavten.",
  "**William Wilberforce** led the parliamentary campaign against the trade, and the Quakers were prominent among the campaigners.":
    "**William Wilberforce** führte die parlamentarische Kampagne gegen den Handel an; unter den Aktivisten waren die Quäker besonders prominent.",
  "**Queen Victoria** reigned from **1837 to 1901** — 64 years, the second longest reign in British history. Britain was at the height of its industrial and imperial power. The **Great Exhibition of 1851** in the Crystal Palace displayed it to the world.":
    "**Königin Victoria** regierte von **1837 bis 1901** – 64 Jahre, die zweitlängste Regierungszeit der britischen Geschichte. Großbritannien stand auf dem Höhepunkt seiner industriellen und imperialen Macht. Die **Weltausstellung von 1851** im Crystal Palace führte das der Welt vor.",
  "The **Reform Act of 1832** began widening the vote, and further acts in 1867 and 1884 extended it — though at the end of Victoria's reign no woman could vote and many working men still could not. Laws limited working hours and child labour, and free primary schooling was introduced.":
    "Der **Reform Act von 1832** begann das Wahlrecht auszuweiten, weitere Gesetze 1867 und 1884 führten das fort – am Ende von Victorias Regierungszeit durfte allerdings keine Frau wählen, und viele Arbeiter ebenfalls nicht. Gesetze begrenzten Arbeitszeiten und Kinderarbeit, und die kostenlose Grundschule wurde eingeführt.",
  "Bonnie Prince Charlie · James Watt · George Stephenson · Isambard Kingdom Brunel · William Wilberforce · Admiral Nelson · the Duke of Wellington · Queen Victoria · Florence Nightingale · Charles Darwin.":
    "Bonnie Prince Charlie · James Watt · George Stephenson · Isambard Kingdom Brunel · William Wilberforce · Admiral Nelson · der Duke of Wellington · Königin Victoria · Florence Nightingale · Charles Darwin.",
  "1707 Act of Union · 1746 Culloden · 1776 American independence · 1801 Union with Ireland · 1805 Trafalgar · 1807 slave trade abolished · 1815 Waterloo · 1832 Reform Act · 1833 slavery abolished · 1837–1901 Victoria · 1851 Great Exhibition · 1859 Origin of Species.":
    "1707 Act of Union · 1746 Culloden · 1776 amerikanische Unabhängigkeit · 1801 Union mit Irland · 1805 Trafalgar · 1807 Abschaffung des Sklavenhandels · 1815 Waterloo · 1832 Reform Act · 1833 Abschaffung der Sklaverei · 1837–1901 Victoria · 1851 Weltausstellung · 1859 Origin of Species.",
  "Jacobites · Industrial Revolution · British Empire · abolition · Reform Act · Crystal Palace.":
    "Jakobiten · Industrielle Revolution · British Empire · Abschaffung der Sklaverei · Reform Act · Crystal Palace.",
  "In one line: 1807 ended the trade in people; 1833 ended slavery itself. Two dates, twenty-six years apart, and the test asks which is which.":
    "In einem Satz: 1807 endete der Handel mit Menschen; 1833 endete die Sklaverei selbst. Zwei Daten, 26 Jahre auseinander – und der Test fragt, welches wofür steht.",

  // ── 9. Britain 1900–Present: Fließtext ──────────────────────────────────
  "Two world wars, votes for women, the founding of the NHS, the end of empire and the arrival of the Britain you live in now.":
    "Zwei Weltkriege, das Frauenwahlrecht, die Gründung des NHS, das Ende des Empire – und die Entstehung des Großbritanniens, in dem du heute lebst.",
  "Britain entered the war in **1914** and it ended on **11 November 1918**. Around a million from Britain and its Empire were killed. That date is why **Remembrance Day** falls on 11 November and why poppies are worn.":
    "Großbritannien trat **1914** in den Krieg ein, der am **11. November 1918** endete. Rund eine Million Menschen aus Großbritannien und seinem Empire fielen. Wegen dieses Datums liegt der **Remembrance Day** auf dem 11. November, und deshalb trägt man Mohnblumen.",
  "The **suffragettes**, led by **Emmeline Pankhurst**, campaigned for the vote — with protests, hunger strikes and imprisonment.":
    "Die **Suffragetten** unter **Emmeline Pankhurst** kämpften für das Wahlrecht – mit Protesten, Hungerstreiks und Gefängnisaufenthalten.",
  "Two dates again. **1918**: women over 30 who met a property qualification got the vote. **1928**: women got the vote on the same terms as men, at 21. The gap of ten years is a favourite question.":
    "Wieder zwei Daten. **1918**: Frauen über 30 mit Grundbesitz erhielten das Wahlrecht. **1928**: Frauen erhielten es zu denselben Bedingungen wie Männer, ab 21. Der Abstand von zehn Jahren ist eine beliebte Frage.",
  "Britain declared war on Germany in **1939** after the invasion of Poland. **Winston Churchill** became Prime Minister in 1940 and led the country through it.":
    "Großbritannien erklärte Deutschland **1939** nach dem Überfall auf Polen den Krieg. **Winston Churchill** wurde 1940 Premierminister und führte das Land hindurch.",
  "The war in Europe ended on **VE Day, 8 May 1945**; the war against Japan ended that August. **Alan Turing** and the codebreakers at **Bletchley Park** broke German ciphers and shortened the war.":
    "Der Krieg in Europa endete am **VE Day, dem 8. Mai 1945**; der Krieg gegen Japan im August desselben Jahres. **Alan Turing** und die Codeknacker von **Bletchley Park** entschlüsselten deutsche Funksprüche und verkürzten den Krieg.",
  "The **Beveridge Report of 1942** set out a plan to tackle what it called the five giants — want, disease, ignorance, squalor and idleness. After the war the Labour government built the **welfare state**, and in **1948 Aneurin Bevan** founded the **National Health Service**, free at the point of use.":
    "Der **Beveridge Report von 1942** entwarf einen Plan gegen die sogenannten fünf Riesen – Not, Krankheit, Unwissenheit, Verwahrlosung und Müßiggang. Nach dem Krieg baute die Labour-Regierung den **Sozialstaat** auf, und **1948** gründete **Aneurin Bevan** den **National Health Service**, kostenlos bei Inanspruchnahme.",
  "After 1945 the colonies became independent, one after another — this is **decolonisation**. **India and Pakistan in 1947** came first, then most of Africa and the Caribbean. Many of the new countries joined the **Commonwealth**, a voluntary association of independent states, now around 56 members. The monarch is its Head, but the Commonwealth has no power over its members.":
    "Nach 1945 wurden die Kolonien eine nach der anderen unabhängig – das ist die **Dekolonisierung**. **Indien und Pakistan 1947** kamen zuerst, dann der Großteil Afrikas und der Karibik. Viele der neuen Staaten traten dem **Commonwealth** bei, einem freiwilligen Zusammenschluss unabhängiger Staaten mit heute rund 56 Mitgliedern. Der Monarch ist sein Oberhaupt, doch das Commonwealth hat keine Macht über seine Mitglieder.",
  "Britain invited workers from the Caribbean, India, Pakistan and elsewhere to help rebuild after the war — the ship **Empire Windrush** arrived in **1948** and gave its name to that generation. Later arrivals came from Uganda, Eastern Europe and around the world. Britain today is a diverse, multi-faith society.":
    "Großbritannien holte nach dem Krieg Arbeitskräfte aus der Karibik, Indien, Pakistan und anderswo zum Wiederaufbau – das Schiff **Empire Windrush** traf **1948** ein und gab dieser Generation ihren Namen. Später kamen Menschen aus Uganda, Osteuropa und aus aller Welt. Großbritannien ist heute eine vielfältige Gesellschaft vieler Religionen.",
  "The UK joined the **European Economic Community in 1973**, which became the **European Union**. In a referendum in **June 2016** the UK voted to leave, and it formally left on **31 January 2020**.":
    "Das Vereinigte Königreich trat **1973** der **Europäischen Wirtschaftsgemeinschaft** bei, aus der die **Europäische Union** wurde. In einem Referendum im **Juni 2016** stimmte es für den Austritt und verließ die EU offiziell am **31. Januar 2020**.",
  "Other landmarks: **Margaret Thatcher** became the first woman Prime Minister in **1979**; the **Good Friday Agreement of 1998** brought peace to Northern Ireland; devolved parliaments opened in Scotland and Wales in **1999**; London hosted the **Olympic Games in 2012**; **Queen Elizabeth II** died in **2022** after 70 years, and **King Charles III** succeeded her.":
    "Weitere Eckpunkte: **Margaret Thatcher** wurde **1979** die erste Premierministerin; das **Karfreitagsabkommen von 1998** brachte Nordirland Frieden; **1999** nahmen die Regionalparlamente in Schottland und Wales ihre Arbeit auf; London richtete **2012** die **Olympischen Spiele** aus; **Königin Elisabeth II.** starb **2022** nach 70 Jahren, und **König Charles III.** folgte ihr nach.",
  "Emmeline Pankhurst · Winston Churchill · Clement Attlee · William Beveridge · Aneurin Bevan · Alan Turing · Margaret Thatcher · Elizabeth II · Charles III.":
    "Emmeline Pankhurst · Winston Churchill · Clement Attlee · William Beveridge · Aneurin Bevan · Alan Turing · Margaret Thatcher · Elisabeth II. · Charles III.",
  "1914–1918 First World War · 1918 and 1928 votes for women · 1939–1945 Second World War · 1940 Battle of Britain · 6 June 1944 D-Day · 8 May 1945 VE Day · 1947 India and Pakistan · 1948 NHS and Windrush · 1973 joined EEC · 1979 Thatcher · 1998 Good Friday Agreement · 1999 devolution · 2012 Olympics · 2016 referendum · 31 January 2020 left the EU · 2022 Charles III.":
    "1914–1918 Erster Weltkrieg · 1918 und 1928 Frauenwahlrecht · 1939–1945 Zweiter Weltkrieg · 1940 Luftschlacht um England · 6. Juni 1944 D-Day · 8. Mai 1945 VE Day · 1947 Indien und Pakistan · 1948 NHS und Windrush · 1973 EWG-Beitritt · 1979 Thatcher · 1998 Karfreitagsabkommen · 1999 Devolution · 2012 Olympische Spiele · 2016 Referendum · 31. Januar 2020 EU-Austritt · 2022 Charles III.",
  "Suffragettes · the Blitz · welfare state · NHS · Commonwealth · decolonisation · Brexit.":
    "Suffragetten · der Blitz · Sozialstaat · NHS · Commonwealth · Dekolonisierung · Brexit.",
  "In one line: 1918 gave the vote to women over 30 with property; 1928 made it equal at 21. Ten years apart, and a favourite question.":
    "In einem Satz: 1918 erhielten Frauen über 30 mit Grundbesitz das Wahlrecht; 1928 wurde es ab 21 gleichgestellt. Zehn Jahre Abstand – eine beliebte Frage.",

  // ── 10. Important Dates & Timeline: Fließtext ───────────────────────────
  "Every date in the six history lessons, in one place and in order. Read this last, and then read it again the night before the test — most history questions are really date questions wearing a costume.":
    "Alle Daten aus den sechs Geschichtslektionen an einem Ort und in der richtigen Reihenfolge. Lies das zuletzt – und dann noch einmal am Abend vor dem Test. Die meisten Geschichtsfragen sind in Wahrheit Datumsfragen in Verkleidung.",
  "Why a timeline earns its own lesson: the test rarely asks what happened. It asks WHEN, or which of two similar events came first. Order is the thing worth drilling.":
    "Warum eine Zeitleiste eine eigene Lektion verdient: Der Test fragt selten, was geschah. Er fragt WANN – oder welches von zwei ähnlichen Ereignissen zuerst kam. Die Reihenfolge ist das, was sich zu üben lohnt.",
  "Every name in the six history lessons appears here in date order rather than by topic.":
    "Jeder Name aus den sechs Geschichtslektionen erscheint hier nach Datum geordnet statt nach Thema.",
  "The whole course in order: c. 2500 BC Stonehenge · 55 BC · AD 43 · AD 410 · 1066 · 1215 · 1314 · 1348 · 1485 · 1588 · 1649 · 1689 · 1707 · 1805 · 1833 · 1918 · 1928 · 1945 · 1948 · 2020 · 2022.":
    "Der ganze Kurs in der richtigen Reihenfolge: ca. 2500 v. Chr. Stonehenge · 55 v. Chr. · 43 n. Chr. · 410 n. Chr. · 1066 · 1215 · 1314 · 1348 · 1485 · 1588 · 1649 · 1689 · 1707 · 1805 · 1833 · 1918 · 1928 · 1945 · 1948 · 2020 · 2022.",
  "Chronology · century · BC and AD · reign · era.":
    "Chronologie · Jahrhundert · v. Chr. und n. Chr. · Regierungszeit · Epoche.",
  "In one line: Most history questions are really date questions. Learn the order and the 'which came first' questions answer themselves.":
    "In einem Satz: Die meisten Geschichtsfragen sind Datumsfragen. Lerne die Reihenfolge, dann beantworten sich die „Was kam zuerst?“-Fragen von selbst.",

  // ── 11. The Monarchy: Fließtext ─────────────────────────────────────────
  "The UK is a **constitutional monarchy**. The monarch is **Head of State**, but does not govern. Parliament makes the law and the Prime Minister runs the government. The monarch's role is formal, ceremonial and strictly non-political.":
    "Das Vereinigte Königreich ist eine **konstitutionelle Monarchie**. Der Monarch ist **Staatsoberhaupt**, regiert aber nicht. Das Parlament macht die Gesetze, der Premierminister führt die Regierung. Die Rolle des Monarchen ist formal, zeremoniell und streng unpolitisch.",
  "The monarch must be politically neutral. They do not vote, do not express political opinions in public, and act on the advice of ministers. That neutrality is the whole point of the office.":
    "Der Monarch muss politisch neutral sein. Er wählt nicht, äußert öffentlich keine politischen Ansichten und handelt auf Rat der Minister. Genau diese Neutralität ist der Sinn des Amtes.",
  "The throne passes by **hereditary succession**. Since a change in the law in 2013, the eldest child inherits regardless of sex — an older sister is no longer passed over for a younger brother. A **coronation** is the ceremony that crowns a new monarch; it takes place at **Westminster Abbey** and is conducted by the **Archbishop of Canterbury**. The monarch succeeds immediately on the death of the previous one — the coronation comes later.":
    "Der Thron geht durch **Erbfolge** über. Seit einer Gesetzesänderung 2013 erbt das älteste Kind unabhängig vom Geschlecht – eine ältere Schwester wird nicht mehr zugunsten eines jüngeren Bruders übergangen. Eine **Krönung** ist die Zeremonie, die einen neuen Monarchen krönt; sie findet in der **Westminster Abbey** statt und wird vom **Archbishop of Canterbury** geleitet. Der Monarch folgt unmittelbar mit dem Tod des Vorgängers nach – die Krönung kommt später.",
  "**King Charles III** became monarch in **September 2022** on the death of his mother, **Queen Elizabeth II**, who had reigned for **70 years** — the longest in British history. The heir to the throne is **Prince William, Prince of Wales**. Members of the Royal Family carry out public duties and support charities.":
    "**König Charles III.** wurde im **September 2022** Monarch, nach dem Tod seiner Mutter **Königin Elisabeth II.**, die **70 Jahre** regiert hatte – am längsten in der britischen Geschichte. Thronfolger ist **Prinz William, Prince of Wales**. Mitglieder der königlichen Familie nehmen öffentliche Aufgaben wahr und unterstützen wohltätige Zwecke.",
  "Elizabeth II · Charles III · Prince William · the Archbishop of Canterbury.":
    "Elisabeth II. · Charles III. · Prinz William · der Archbishop of Canterbury.",
  "Elizabeth II reigned 1952–2022, 70 years. Charles III from September 2022. Royal Assent last refused 1708. Succession law changed 2013.":
    "Elisabeth II. regierte 1952–2022, 70 Jahre. Charles III. seit September 2022. Royal Assent zuletzt 1708 verweigert. Thronfolgerecht 2013 geändert.",
  "Constitutional monarchy · Head of State · Royal Assent · State Opening of Parliament · coronation · hereditary succession · Head of the Commonwealth.":
    "Konstitutionelle Monarchie · Staatsoberhaupt · Royal Assent · State Opening of Parliament · Krönung · Erbfolge · Oberhaupt des Commonwealth.",
  "In one line: The monarch reigns but does not govern, and must stay politically neutral. Royal Assent is a formality, not a veto.":
    "In einem Satz: Der Monarch herrscht, regiert aber nicht, und muss politisch neutral bleiben. Royal Assent ist eine Formsache, kein Vetorecht.",

  // ── 12. Government & Parliament: Fließtext ──────────────────────────────
  "Parliament sits at the **Palace of Westminster** in London. It has two chambers — the House of Commons and the House of Lords — and the monarch. Almost every test question about government comes down to knowing which of the two chambers does what.":
    "Das Parlament tagt im **Palace of Westminster** in London. Es besteht aus zwei Kammern – dem House of Commons und dem House of Lords – sowie dem Monarchen. Fast jede Testfrage zur Regierung läuft darauf hinaus, zu wissen, welche der beiden Kammern was tut.",
  "A **general election** must be held at least every **five years**. The UK is divided into **constituencies**, and each elects one MP by **first past the post** — whoever gets the most votes wins the seat.":
    "Eine **Parlamentswahl** muss mindestens alle **fünf Jahre** stattfinden. Das Land ist in **Wahlkreise** eingeteilt, und jeder wählt einen Abgeordneten nach dem Prinzip **first past the post** – wer die meisten Stimmen hat, gewinnt den Sitz.",
  "A proposal is a **bill**. It is debated and voted on in the Commons, then in the Lords, then returns to the Commons if the Lords amended it. Once both agree, it goes to the monarch for **Royal Assent** and becomes an **Act of Parliament**.":
    "Ein Vorschlag heißt **bill**. Er wird im Unterhaus debattiert und abgestimmt, dann im Oberhaus, und kehrt ins Unterhaus zurück, wenn die Lords ihn geändert haben. Sind beide einig, geht er zum Monarchen für den **Royal Assent** und wird zum **Act of Parliament**.",
  "**Councils** run local services — schools, refuse collection, housing, roads, libraries and planning. Councillors are elected, usually for four years, and councils are funded by **council tax** and by central government. Many areas also elect a **mayor**.":
    "**Gemeinderäte** betreiben die örtlichen Dienste – Schulen, Müllabfuhr, Wohnungswesen, Straßen, Büchereien und Bauplanung. Ratsmitglieder werden gewählt, meist für vier Jahre, und die Räte finanzieren sich über die **council tax** und Mittel der Zentralregierung. Viele Gebiete wählen zusätzlich eine **Bürgermeisterin oder einen Bürgermeister**.",
  "Why the civil service is separate: civil servants carry out government policy but are politically neutral and stay in post when the government changes. Ministers come and go; the machine does not.":
    "Warum der öffentliche Dienst getrennt ist: Beamte setzen die Regierungspolitik um, sind aber politisch neutral und bleiben im Amt, wenn die Regierung wechselt. Minister kommen und gehen; der Apparat bleibt.",
  "The Prime Minister · the Chancellor of the Exchequer · the Home Secretary · the Speaker · the Leader of the Opposition.":
    "Der Premierminister · der Chancellor of the Exchequer · der Home Secretary · der Speaker · der Leader of the Opposition.",
  "650 MPs. General elections at least every 5 years. Voting age 18. Councillors usually elected for 4 years.":
    "650 Abgeordnete. Parlamentswahlen mindestens alle 5 Jahre. Wahlalter 18. Ratsmitglieder meist für 4 Jahre gewählt.",
  "House of Commons · House of Lords · constituency · first past the post · by-election · Cabinet · shadow cabinet · bill · Act of Parliament · civil service · council tax.":
    "House of Commons · House of Lords · Wahlkreis · first past the post · Nachwahl · Kabinett · Schattenkabinett · Gesetzentwurf · Act of Parliament · öffentlicher Dienst · council tax.",
  "In one line: The Commons is elected and holds the power; the Lords is appointed and can only revise and delay. That split answers most questions here.":
    "In einem Satz: Das Unterhaus ist gewählt und hat die Macht; das Oberhaus ist ernannt und kann nur überarbeiten und verzögern. Diese Trennung beantwortet die meisten Fragen hier.",

  // ── 13. Devolution: Fließtext ───────────────────────────────────────────
  "**Devolution** means powers handed from the UK Parliament in Westminster to elected bodies in Scotland, Wales and Northern Ireland. It began after referendums in the late 1990s, and the three bodies first sat in **1999**.":
    "**Devolution** bedeutet, dass Befugnisse vom UK Parliament in Westminster an gewählte Vertretungen in Schottland, Wales und Nordirland übergeben werden. Sie begann nach Referenden Ende der 1990er, und die drei Körperschaften traten **1999** erstmals zusammen.",
  "Broadly the same list in each nation: **health, education, housing, transport, policing (in Scotland and Northern Ireland), the environment, agriculture** and local government. This is why the NHS, schools and university fees genuinely differ between the four nations.":
    "In jeder Nation weitgehend dieselbe Liste: **Gesundheit, Bildung, Wohnen, Verkehr, Polizei (in Schottland und Nordirland), Umwelt, Landwirtschaft** und Kommunalverwaltung. Deshalb unterscheiden sich NHS, Schulen und Studiengebühren zwischen den vier Nationen tatsächlich.",
  "Westminster keeps the matters that must be decided for the whole country — these are called **reserved matters**: **defence, foreign policy, immigration and nationality, the currency, most taxation, and national security**.":
    "Westminster behält die Themen, die für das ganze Land entschieden werden müssen – sie heißen **reserved matters**: **Verteidigung, Außenpolitik, Einwanderung und Staatsangehörigkeit, Währung, die meisten Steuern und nationale Sicherheit**.",
  "England has no devolved parliament of its own. English matters are decided by the UK Parliament, which is why the two are easy to confuse.":
    "England hat kein eigenes Regionalparlament. Englische Angelegenheiten entscheidet das UK Parliament – deshalb werden die beiden leicht verwechselt.",
  "Holyrood · the Senedd · Stormont.": "Holyrood · die Senedd · Stormont.",
  "Referendums 1997. All three bodies first sat in 1999. Good Friday Agreement 1998. Senedd renamed 2020.":
    "Referenden 1997. Alle drei Körperschaften traten 1999 erstmals zusammen. Karfreitagsabkommen 1998. Senedd 2020 umbenannt.",
  "Devolution · devolved matter · reserved matter · MSP · MS · MLA · power sharing.":
    "Devolution · übertragene Zuständigkeit · vorbehaltene Zuständigkeit · MSP · MS · MLA · Machtteilung.",
  "In one line: Health, education and housing are devolved; defence, foreign policy, immigration and the currency are reserved to Westminster. England has no devolved parliament.":
    "In einem Satz: Gesundheit, Bildung und Wohnen sind übertragen; Verteidigung, Außenpolitik, Einwanderung und Währung bleiben bei Westminster. England hat kein eigenes Regionalparlament.",

  // ── 14. Law & Justice: Fließtext ────────────────────────────────────────
  "The **rule of law** means everyone is subject to the law — including the government, the police and the monarch's ministers. Judges are independent of government, and no one may be punished except by a court.":
    "Die **Rechtsstaatlichkeit** bedeutet, dass alle dem Gesetz unterliegen – auch die Regierung, die Polizei und die Minister der Krone. Richter sind von der Regierung unabhängig, und niemand darf außer durch ein Gericht bestraft werden.",
  "If you are on the electoral register and aged **18 to 70**, you may be summoned for **jury service**. It is a duty, not a request — you must attend unless you are excused. A jury decides the facts: whether the accused is guilty or not guilty. The judge decides the law and the sentence.":
    "Wenn du im Wählerverzeichnis stehst und zwischen **18 und 70** bist, kannst du zum **Schöffendienst** geladen werden. Das ist eine Pflicht, keine Bitte – du musst erscheinen, sofern du nicht befreit wirst. Die Jury entscheidet über die Tatsachen: ob die angeklagte Person schuldig ist oder nicht. Der Richter entscheidet über das Recht und das Strafmaß.",
  "**Legal aid** is public funding that pays for legal advice or representation for people who cannot afford it. It exists so that the right to a fair trial is real rather than theoretical.":
    "**Legal aid** ist öffentliche Finanzierung für Rechtsberatung oder Vertretung von Menschen, die sie sich nicht leisten können. Es gibt sie, damit das Recht auf ein faires Verfahren real und nicht bloß theoretisch ist.",
  "Why juries are drawn at random: a jury of ordinary people, chosen by lot rather than appointed, is what stops the state deciding guilt on its own. That is the rule of law in practice.":
    "Warum Jurys ausgelost werden: Eine Jury aus gewöhnlichen Menschen, per Los bestimmt statt ernannt, verhindert, dass der Staat allein über Schuld entscheidet. Das ist Rechtsstaatlichkeit in der Praxis.",
  "Magistrates · judges · solicitors · barristers · the Supreme Court.":
    "Magistrates · Richter · Solicitors · Barristers · der Supreme Court.",
  "Jury of 12 in England, Wales and Northern Ireland; 15 in Scotland. Jury service 18–70. Supreme Court took over from the Lords in 2009. Age of criminal responsibility 12 in Scotland, 10 elsewhere.":
    "Jury mit 12 Mitgliedern in England, Wales und Nordirland; 15 in Schottland. Schöffendienst 18–70. Der Supreme Court löste 2009 das Oberhaus ab. Strafmündigkeit mit 12 in Schottland, sonst mit 10.",
  "Rule of law · criminal law · civil law · Magistrates' Court · Crown Court · County Court · legal aid · jury service.":
    "Rechtsstaatlichkeit · Strafrecht · Zivilrecht · Magistrates' Court · Crown Court · County Court · legal aid · Schöffendienst.",
  "In one line: The jury decides the facts, the judge decides the law and the sentence — and everyone, including the government, is subject to both.":
    "In einem Satz: Die Jury entscheidet über die Tatsachen, der Richter über Recht und Strafmaß – und alle, auch die Regierung, unterliegen beidem.",

  // ── 15. Rights & Responsibilities: Fließtext ────────────────────────────
  "Lesson 1 introduced the values. This one is the practical side: what you are entitled to, and what is expected of you in return.":
    "Lektion 1 hat die Werte eingeführt. Hier geht es um die praktische Seite: worauf du Anspruch hast und was im Gegenzug von dir erwartet wird.",
  "Most people pay income tax through **PAYE** — deducted by an employer before wages are paid. The self-employed complete a **Self Assessment** tax return each year. Tax funds the NHS, schools, roads, defence and the police. **HM Revenue and Customs (HMRC)** collects it.":
    "Die meisten zahlen Einkommensteuer über **PAYE** – der Arbeitgeber zieht sie vor der Lohnzahlung ab. Selbstständige geben jedes Jahr eine **Self-Assessment**-Steuererklärung ab. Steuern finanzieren NHS, Schulen, Straßen, Verteidigung und Polizei. Eingezogen werden sie von **HM Revenue and Customs (HMRC)**.",
  "Volunteering, joining a school governing body, helping a charity, standing as a councillor, or simply voting — participation is treated as part of citizenship rather than an optional extra.":
    "Ehrenamt, Mitarbeit im Schulbeirat, Hilfe für eine Wohltätigkeitsorganisation, Kandidatur als Ratsmitglied oder einfach wählen gehen – Teilhabe gilt als Teil der Staatsbürgerschaft, nicht als freiwilliges Extra.",
  "HM Revenue and Customs (HMRC).": "HM Revenue and Customs (HMRC) – die britische Steuerbehörde.",
  "Vote at 18. Jury service 18–70. Human Rights Act 1998. Equality Act 2010.":
    "Wahlrecht ab 18. Schöffendienst 18–70. Human Rights Act 1998. Equality Act 2010.",
  "PAYE · Self Assessment · National Insurance · income tax · secret ballot · human rights · protected characteristics.":
    "PAYE · Self Assessment · National Insurance · Einkommensteuer · geheime Wahl · Menschenrechte · geschützte Merkmale.",
  "In one line: Every right carries a duty: the vote and the electoral register, the NHS and your taxes, a fair trial and jury service.":
    "In einem Satz: Zu jedem Recht gehört eine Pflicht – Wahlrecht und Wählerverzeichnis, NHS und Steuern, faires Verfahren und Schöffendienst.",

  // ── 16. British Society & Culture: Fließtext ────────────────────────────
  "The UK is a diverse society of around **67 million** people. England is much the largest of the four nations. Roughly a fifth of people belong to a minority ethnic group, and the largest cities are the most diverse.":
    "Das Vereinigte Königreich ist eine vielfältige Gesellschaft mit rund **67 Millionen** Menschen. England ist mit Abstand die größte der vier Nationen. Etwa ein Fünftel gehört einer ethnischen Minderheit an, und die größten Städte sind am vielfältigsten.",
  "Most households are small. Both parents commonly work, and children usually leave home in their late teens or twenties. Older relatives often live independently rather than with their children.":
    "Die meisten Haushalte sind klein. Üblicherweise arbeiten beide Elternteile, und Kinder ziehen meist mit Ende der Teenagerjahre oder in den Zwanzigern aus. Ältere Angehörige leben oft eigenständig statt bei ihren Kindern.",
  "Volunteering is widespread and highly regarded — charity shops, food banks, sports clubs, school governors, the National Trust, hospital and mountain rescue volunteers. Charities are a large part of British life, and giving time is seen as valuable as giving money.":
    "Ehrenamt ist weit verbreitet und hoch angesehen – Second-Hand-Läden für gute Zwecke, Tafeln, Sportvereine, Schulbeiräte, der National Trust, Helfer in Krankenhäusern und in der Bergrettung. Wohltätigkeit ist ein großer Teil des britischen Lebens, und Zeit zu geben gilt als ebenso wertvoll wie Geld zu geben.",
  "Queuing, punctuality, saying please and thank you, and apologising readily are all noticed. Politeness matters more than formality, and small talk about the weather is genuinely a social convention rather than a joke about one.":
    "Anstehen, Pünktlichkeit, bitte und danke sagen und sich rasch entschuldigen – all das fällt auf. Höflichkeit zählt mehr als Förmlichkeit, und Small Talk über das Wetter ist wirklich eine gesellschaftliche Konvention und nicht bloß ein Witz darüber.",
  "No names to memorise — this lesson is about how people live rather than who they were.":
    "Keine Namen zum Auswendiglernen – in dieser Lektion geht es darum, wie Menschen leben, nicht darum, wer sie waren.",
  "Population around 67 million. Same-sex marriage 2014 in England, Wales and Scotland; 2020 in Northern Ireland. Marriage age raised to 18 in England and Wales in 2023.":
    "Bevölkerung rund 67 Millionen. Gleichgeschlechtliche Ehe 2014 in England, Wales und Schottland; 2020 in Nordirland. Heiratsalter 2023 in England und Wales auf 18 angehoben.",
  "Civil partnership · forced marriage · arranged marriage · volunteering · community · diversity.":
    "Eingetragene Partnerschaft · Zwangsheirat · arrangierte Ehe · Ehrenamt · Gemeinschaft · Vielfalt.",
  "In one line: An arranged marriage both people freely accept is lawful. A forced marriage is a crime. Consent is the whole distinction.":
    "In einem Satz: Eine arrangierte Ehe, der beide frei zustimmen, ist zulässig. Eine Zwangsheirat ist eine Straftat. Die Zustimmung macht den ganzen Unterschied.",

  // ── 17. Religion & Beliefs: Fließtext ───────────────────────────────────
  "The UK is historically Christian but is now a multi-faith society, and a large and growing share of people report no religion at all. **Freedom of religion** is a legal right: you may practise any faith or none, and change your faith.":
    "Das Vereinigte Königreich ist historisch christlich, heute aber eine Gesellschaft vieler Religionen – und ein großer, wachsender Teil der Menschen gibt gar keine Religion an. **Religionsfreiheit** ist ein Rechtsanspruch: Du darfst jeden Glauben oder keinen praktizieren und deinen Glauben wechseln.",
  "Religious tolerance is one of the fundamental values. It protects believers of every faith **and** those with none, and it is unlawful to discriminate against someone for their religion or belief. Places of worship for all major faiths are found across the UK.":
    "Religiöse Toleranz ist einer der Grundwerte. Sie schützt Gläubige jeder Religion **und** Menschen ohne Glauben, und Diskriminierung wegen Religion oder Weltanschauung ist rechtswidrig. Gebetsstätten aller großen Religionen gibt es im ganzen Land.",
  "The Archbishop of Canterbury · Guru Nanak · the Church of England · the Church of Scotland.":
    "Der Archbishop of Canterbury · Guru Nanak · die Church of England · die Church of Scotland.",
  "Church of England established since Henry VIII's break with Rome in the 1530s.":
    "Die Church of England ist seit Heinrichs VIII. Bruch mit Rom in den 1530er-Jahren Staatskirche.",
  "Established church · Supreme Governor · Anglican · Presbyterian · religious tolerance · freedom of belief.":
    "Staatskirche · Supreme Governor · anglikanisch · presbyterianisch · religiöse Toleranz · Glaubensfreiheit.",
  "In one line: England has an established church with the monarch at its head; Scotland's is Presbyterian; Wales and Northern Ireland have none.":
    "In einem Satz: England hat eine Staatskirche mit dem Monarchen an der Spitze; Schottlands ist presbyterianisch; Wales und Nordirland haben keine.",

  // ── 18. British Traditions & Celebrations: Fließtext ────────────────────
  "Some of these are public holidays, some are simply widely marked. The test asks which is which, and it asks dates — so learn the date alongside the name.":
    "Einige davon sind gesetzliche Feiertage, andere werden einfach breit begangen. Der Test fragt, was wovon ist – und er fragt Daten ab. Lerne das Datum also zusammen mit dem Namen.",
  "**St David's Day, 1 March** (Wales); **St Patrick's Day, 17 March** (Northern Ireland); **St George's Day, 23 April** (England); **St Andrew's Day, 30 November** (Scotland). Only St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland are public holidays.":
    "**St David's Day, 1. März** (Wales); **St Patrick's Day, 17. März** (Nordirland); **St George's Day, 23. April** (England); **St Andrew's Day, 30. November** (Schottland). Nur der St Patrick's Day in Nordirland und der St Andrew's Day in Schottland sind gesetzliche Feiertage.",
  "**Bank holidays** are public holidays when most businesses close. They differ between the four nations — Scotland and Northern Ireland each have days the others do not. Besides Christmas and Easter there are holidays in early May, late May and August.":
    "**Bank holidays** sind gesetzliche Feiertage, an denen die meisten Betriebe schließen. Sie unterscheiden sich zwischen den vier Nationen – Schottland und Nordirland haben jeweils Tage, die die anderen nicht haben. Neben Weihnachten und Ostern gibt es Feiertage Anfang Mai, Ende Mai und im August.",
  "Guy Fawkes · Robert Burns · the four patron saints.":
    "Guy Fawkes · Robert Burns · die vier Schutzheiligen.",
  "1 January · 25 January Burns Night · 1 March · 17 March · 23 April · 31 October · 5 November · 11 November · 30 November · 25 and 26 December. Gunpowder Plot 1605. Armistice 1918.":
    "1. Januar · 25. Januar Burns Night · 1. März · 17. März · 23. April · 31. Oktober · 5. November · 11. November · 30. November · 25. und 26. Dezember. Schießpulver-Attentat 1605. Waffenstillstand 1918.",
  "Bank holiday · Hogmanay · Shrove Tuesday · Remembrance · Boxing Day.":
    "Gesetzlicher Feiertag · Hogmanay · Faschingsdienstag · Gedenken · Boxing Day.",
  "In one line: Only St Patrick's Day in Northern Ireland and St Andrew's Day in Scotland are public holidays. The other two saints' days are not.":
    "In einem Satz: Nur der St Patrick's Day in Nordirland und der St Andrew's Day in Schottland sind gesetzliche Feiertage. Die beiden anderen Heiligentage nicht.",

  // ── 19. Sports & Leisure: Fließtext ─────────────────────────────────────
  "Britain invented or codified a remarkable number of the world's sports, and the test asks about the events as much as the games — which tournament is played where.":
    "Großbritannien hat bemerkenswert viele Sportarten der Welt erfunden oder ihre Regeln festgelegt, und der Test fragt ebenso nach den Veranstaltungen wie nach den Sportarten – welches Turnier wo stattfindet.",
  "Gardening, walking, going to the pub, watching television and following a team are all common. The **National Trust** cares for historic houses, gardens and coastline, and public footpaths give a legal right of way across much of the countryside.":
    "Gärtnern, Spazierengehen, in den Pub gehen, fernsehen und einer Mannschaft folgen sind alle verbreitet. Der **National Trust** kümmert sich um historische Häuser, Gärten und Küstenabschnitte, und öffentliche Fußwege gewähren ein gesetzliches Wegerecht über weite Teile des Landes.",
  "Wimbledon · Lord's · St Andrews · Aintree · Ascot · the National Trust.":
    "Wimbledon · Lord's · St Andrews · Aintree · Ascot · der National Trust.",
  "London hosted the Olympics in 1908, 1948 and 2012. Commonwealth Games every four years.":
    "London richtete die Olympischen Spiele 1908, 1948 und 2012 aus. Commonwealth Games alle vier Jahre.",
  "The Ashes · Six Nations · FA Cup · Grand National · rugby union and rugby league · Paralympics.":
    "The Ashes · Six Nations · FA Cup · Grand National · Rugby Union und Rugby League · Paralympics.",
  "In one line: Golf is Scottish, cricket and rugby are English, and at the Commonwealth Games the four nations compete separately rather than as one team.":
    "In einem Satz: Golf ist schottisch, Cricket und Rugby sind englisch, und bei den Commonwealth Games treten die vier Nationen einzeln an, nicht als ein Team.",

  // ── 20. Literature, Art & Music: Fließtext ──────────────────────────────
  "Names and one fact each. The test does not expect you to have read the books — it expects you to know who wrote what, and which nation claims them.":
    "Namen und je ein Fakt. Der Test erwartet nicht, dass du die Bücher gelesen hast – sondern dass du weißt, wer was geschrieben hat und welche Nation die Person für sich beansprucht.",
  "**The Beatles** — John Lennon, Paul McCartney, George Harrison and Ringo Starr — came from **Liverpool** and are the most successful British band ever. Also from Britain: the Rolling Stones, Queen, David Bowie, Elton John and Adele.":
    "**The Beatles** – John Lennon, Paul McCartney, George Harrison und Ringo Starr – kamen aus **Liverpool** und sind die erfolgreichste britische Band aller Zeiten. Ebenfalls aus Großbritannien: die Rolling Stones, Queen, David Bowie, Elton John und Adele.",
  "In classical music, **Henry Purcell**, **Edward Elgar**, **Gustav Holst**, **Ralph Vaughan Williams** and **Benjamin Britten**. The **Proms** — a summer season of concerts at the Royal Albert Hall, ending with the Last Night — has run since 1895.":
    "In der klassischen Musik **Henry Purcell**, **Edward Elgar**, **Gustav Holst**, **Ralph Vaughan Williams** und **Benjamin Britten**. Die **Proms** – eine sommerliche Konzertreihe in der Royal Albert Hall, die mit der Last Night endet – gibt es seit 1895.",
  "Chaucer · Shakespeare · Jane Austen · Charles Dickens · Robert Burns · Turner · Constable · Gainsborough · Henry Moore · The Beatles · Elgar.":
    "Chaucer · Shakespeare · Jane Austen · Charles Dickens · Robert Burns · Turner · Constable · Gainsborough · Henry Moore · The Beatles · Elgar.",
  "Shakespeare 1564–1616. British Museum founded 1753. The Proms since 1895. Burns Night 25 January.":
    "Shakespeare 1564–1616. British Museum 1753 gegründet. Die Proms seit 1895. Burns Night am 25. Januar.",
  "The Globe Theatre · the Turner Prize · the National Gallery · the British Museum · the Last Night of the Proms.":
    "Das Globe Theatre · der Turner Prize · die National Gallery · das British Museum · die Last Night of the Proms.",
  "In one line: One name, one fact. Chaucer came before Shakespeare, Burns is Scotland's poet, and The Beatles came from Liverpool.":
    "In einem Satz: Ein Name, ein Fakt. Chaucer kam vor Shakespeare, Burns ist Schottlands Dichter, und die Beatles kamen aus Liverpool.",

  // ── 21. Science & Inventions: Fließtext ─────────────────────────────────
  "British science shows up repeatedly in the test, usually as one name attached to one discovery. Learn the pairs.":
    "Britische Wissenschaft taucht im Test immer wieder auf, meist als ein Name zu einer Entdeckung. Lerne die Paare.",
  "**Alan Turing** laid the foundations of computer science and broke German codes at Bletchley Park. The first successful **IVF** birth took place in England in 1978. The **Royal Society**, founded in the 1660s, is the oldest scientific institution still in existence. **Dolly the sheep**, the first cloned mammal, was created in Scotland in 1996.":
    "**Alan Turing** legte die Grundlagen der Informatik und knackte in Bletchley Park deutsche Codes. Die erste erfolgreiche **künstliche Befruchtung (IVF)** führte 1978 in England zu einer Geburt. Die **Royal Society**, in den 1660er-Jahren gegründet, ist die älteste noch bestehende wissenschaftliche Institution. **Das Schaf Dolly**, das erste geklonte Säugetier, entstand 1996 in Schottland.",
  "Isaac Newton · Charles Darwin · Alexander Fleming · Michael Faraday · Ernest Rutherford · Rosalind Franklin · James Watt · George Stephenson · Brunel · Alexander Graham Bell · John Logie Baird · Alan Turing · Tim Berners-Lee.":
    "Isaac Newton · Charles Darwin · Alexander Fleming · Michael Faraday · Ernest Rutherford · Rosalind Franklin · James Watt · George Stephenson · Brunel · Alexander Graham Bell · John Logie Baird · Alan Turing · Tim Berners-Lee.",
  "Origin of Species 1859 · penicillin 1928 · first IVF birth 1978 · World Wide Web 1989 · Dolly the sheep 1996. Royal Society founded in the 1660s.":
    "Origin of Species 1859 · Penicillin 1928 · erste IVF-Geburt 1978 · World Wide Web 1989 · das Schaf Dolly 1996. Royal Society in den 1660er-Jahren gegründet.",
  "Natural selection · antibiotic · electromagnetic induction · DNA · the World Wide Web · cloning.":
    "Natürliche Auslese · Antibiotikum · elektromagnetische Induktion · DNA · das World Wide Web · Klonen.",
  "In one line: Learn these as pairs — one person, one discovery. That is exactly how the test asks about them.":
    "In einem Satz: Lerne sie als Paare – eine Person, eine Entdeckung. Genau so fragt der Test danach.",

  // ── 22. Famous British People: Fließtext ────────────────────────────────
  "One place to revise every name in the course, sorted by what they are known for. If a name here is unfamiliar, go back to the lesson it came from.":
    "Ein Ort, um alle Namen des Kurses zu wiederholen, sortiert danach, wofür sie bekannt sind. Ist dir ein Name hier fremd, geh zurück zu der Lektion, aus der er stammt.",
  "**Admiral Nelson** at Trafalgar in 1805, the **Duke of Wellington** at Waterloo in 1815, **Boudicca** against the Romans, **William Wallace** and **Robert the Bruce** for Scotland, and **Captain James Cook**, whose voyages mapped much of the Pacific.":
    "**Admiral Nelson** bei Trafalgar 1805, der **Duke of Wellington** bei Waterloo 1815, **Boudicca** gegen die Römer, **William Wallace** und **Robert the Bruce** für Schottland und **Captain James Cook**, dessen Reisen weite Teile des Pazifiks kartierten.",
  "Every name in the course, grouped by what they are known for — monarchs, politicians, scientists, writers, artists and reformers.":
    "Alle Namen des Kurses, gruppiert nach dem, wofür sie bekannt sind – Monarchen, Politiker, Wissenschaftler, Schriftsteller, Künstler und Reformer.",
  "The dates belong to the lessons these people came from; this one is for matching the person to the achievement.":
    "Die Jahreszahlen gehören zu den Lektionen, aus denen diese Personen stammen; hier geht es darum, Person und Leistung einander zuzuordnen.",
  "Monarch · Prime Minister · reformer · abolitionist · suffragette · engineer · physicist.":
    "Monarch · Premierminister · Reformer · Abolitionist · Suffragette · Ingenieur · Physiker.",
  "In one line: If a name here is unfamiliar, go back to the lesson it came from rather than trying to learn it in isolation.":
    "In einem Satz: Ist dir hier ein Name fremd, geh zurück zu seiner Lektion, statt ihn isoliert lernen zu wollen.",

  // ── 23. Education & Healthcare: Fließtext ───────────────────────────────
  "Two things you will use, and two things the test asks about in practical terms: how school works, and how to get medical help.":
    "Zwei Dinge, die du brauchen wirst, und zwei, nach denen der Test ganz praktisch fragt: wie die Schule funktioniert und wie man ärztliche Hilfe bekommt.",
  "Education is **compulsory** for children aged **5 to 16** (4 to 16 in Northern Ireland). In England, young people must stay in education or training until 18. State schooling is free.":
    "Schulpflicht besteht für Kinder von **5 bis 16 Jahren** (4 bis 16 in Nordirland). In England müssen Jugendliche bis 18 in Ausbildung oder Schule bleiben. Der Besuch staatlicher Schulen ist kostenlos.",
  "Parents must make sure their children attend. Schools have **governing bodies** that parents can join, and there is a national curriculum in England.":
    "Eltern müssen dafür sorgen, dass ihre Kinder zur Schule gehen. Schulen haben **Schulbeiräte**, in denen Eltern mitwirken können, und in England gibt es einen nationalen Lehrplan.",
  "The **National Health Service** was founded in **1948** by **Aneurin Bevan**. Its principle is care **free at the point of use**, paid for through taxation, based on need rather than ability to pay.":
    "Der **National Health Service** wurde **1948** von **Aneurin Bevan** gegründet. Sein Grundsatz ist Versorgung, die **bei Inanspruchnahme kostenlos** ist, finanziert über Steuern und ausgerichtet am Bedarf statt an der Zahlungsfähigkeit.",
  "Dial **999** or **112** for police, ambulance, fire or coastguard. Both numbers are free from any phone. For urgent but non-life-threatening medical help call **111**; for non-emergency police matters call **101**.":
    "Wähle **999** oder **112** für Polizei, Rettungsdienst, Feuerwehr oder Küstenwache. Beide Nummern sind von jedem Telefon aus kostenlos. Für dringende, aber nicht lebensbedrohliche medizinische Hilfe wähle **111**; für Polizeiangelegenheiten ohne Notfall **101**.",
  "999 is for emergencies only — a life at risk, a serious injury, a crime in progress or a fire. Misusing it is an offence, and 111 exists for everything urgent that is not an emergency.":
    "999 ist ausschließlich für Notfälle – Lebensgefahr, schwere Verletzung, eine laufende Straftat oder ein Feuer. Missbrauch ist eine Straftat, und für alles Dringende, das kein Notfall ist, gibt es die 111.",
  "Aneurin Bevan · your GP · Oxford and Cambridge.":
    "Aneurin Bevan · deine Hausarztpraxis · Oxford und Cambridge.",
  "School compulsory 5–16 (4–16 in Northern Ireland); education or training to 18 in England. NHS founded 1948. Emergency 999 or 112; urgent advice 111; non-emergency police 101.":
    "Schulpflicht 5–16 (4–16 in Nordirland); Schule oder Ausbildung bis 18 in England. NHS 1948 gegründet. Notruf 999 oder 112; dringende Beratung 111; Polizei ohne Notfall 101.",
  "GCSE · A level · Highers · National Qualifications · further education · higher education · GP · free at the point of use · prescription charge.":
    "GCSE · A level · Highers · National Qualifications · weiterführende Bildung · Hochschulbildung · Hausarztpraxis · kostenlos bei Inanspruchnahme · Rezeptgebühr.",
  "In one line: 999 is for emergencies only and misusing it is an offence. 111 is the number for everything urgent that is not one.":
    "In einem Satz: 999 ist nur für Notfälle, und Missbrauch ist strafbar. 111 ist die Nummer für alles Dringende, das kein Notfall ist.",

  // ── Restliche Lernbereich-Listen aus den Lektionen 2 bis 4 ──────────────
  "Ben Nevis · Snowdon (Yr Wyddfa) · Scafell Pike · Slieve Donard · Severn · Thames · Lough Neagh · Loch Lomond · Windermere.":
    "Ben Nevis · Snowdon (Yr Wyddfa) · Scafell Pike · Slieve Donard · Severn · Themse · Lough Neagh · Loch Lomond · Windermere.",
  "Channel Tunnel opened 1994. 15 National Parks. Northern Ireland has 6 counties.":
    "Kanaltunnel 1994 eröffnet. 15 Nationalparks. Nordirland hat 6 Grafschaften.",
  "United Kingdom vs Great Britain · Crown Dependency · county · region · saltire · devolved capital.":
    "Vereinigtes Königreich vs. Großbritannien · Crown Dependency · Grafschaft · Region · Saltire · Hauptstadt mit eigenem Parlament.",
  "St David · St Patrick · St George · St Andrew · Y Ddraig Goch (the Red Dragon).":
    "St David · St Patrick · St George · St Andrew · Y Ddraig Goch (der Rote Drache).",
  "St David 1 March · St Patrick 17 March · St George 23 April · St Andrew 30 November. First Union Flag 1606.":
    "St David 1. März · St Patrick 17. März · St George 23. April · St Andrew 30. November. Erste Union Flag 1606.",
  "Union Flag / Union Jack · saltire · patron saint · Tudor rose · thistle · daffodil · leek · shamrock.":
    "Union Flag / Union Jack · Saltire · Schutzheiliger · Tudor-Rose · Distel · Osterglocke · Lauch · Kleeblatt.",
  "Julius Caesar · Claudius · Hadrian · Boudicca · Alfred the Great · St Augustine · St Columba · William of Normandy.":
    "Julius Caesar · Claudius · Hadrian · Boudicca · Alfred der Große · St Augustine · St Columba · Wilhelm von der Normandie.",
  "55 BC Caesar fails · AD 43 Claudius invades · AD 122 Hadrian's Wall · AD 410 Romans leave · AD 789 first Viking raids · 1066 Hastings.":
    "55 v. Chr. Caesar scheitert · 43 n. Chr. Claudius fällt ein · 122 n. Chr. Hadrianswall · 410 n. Chr. Abzug der Römer · 789 n. Chr. erste Wikingerüberfälle · 1066 Hastings.",
  "Celts · Danelaw · Anglo-Saxons · Iceni · Picts · Norman Conquest.":
    "Kelten · Danelaw · Angelsachsen · Icener · Pikten · normannische Eroberung.",

  // ── Ersetzt, nachdem die Prüfungsorganisation aus Lektion 1 entfernt wurde ──
  "British society rests on a short list of shared values. They are not decoration: they are what the law, the courts and everyday expectations are built on, and understanding them explains a great deal of what follows in this course.":
    "Die britische Gesellschaft ruht auf einer kurzen Liste gemeinsamer Werte. Sie sind keine Zierde: Auf ihnen bauen das Recht, die Gerichte und die alltäglichen Erwartungen auf – und wer sie versteht, versteht vieles von dem, was in diesem Kurs folgt.",
  "Equality Act 2010 — the law that sets out the nine protected characteristics. Human Rights Act 1998.":
    "Equality Act 2010 – das Gesetz, das die neun geschützten Merkmale festlegt. Human Rights Act 1998.",
  "Rule of law · individual liberty · tolerance · protected characteristics · discrimination · rights and responsibilities.":
    "Rule of law · persönliche Freiheit · Toleranz · geschützte Merkmale · Diskriminierung · Rechte und Pflichten.",
  "In one line: The values are a list you may be asked to complete or spot a gap in, and every right on it has a matching duty.":
    "In einem Satz: Die Werte sind eine Liste, die du vervollständigen oder in der du eine Lücke erkennen sollst – und zu jedem Recht gehört eine Pflicht.",
  "Now answer these": "Jetzt beantworte diese Fragen",

  // ── Kurskopf ──
  "History, government and traditions — how life in the UK works.":
    "Geschichte, Regierung und Traditionen – wie das Leben in Großbritannien funktioniert.",
};
