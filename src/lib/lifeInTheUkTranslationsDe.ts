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
  // ── 1. British Values & Principles ──────────────────────────────────────
  "The fundamental principles": "Die Grundprinzipien",
  "Equality: the nine protected characteristics": "Gleichheit: die neun geschützten Merkmale",
  "Rights and responsibilities": "Rechte und Pflichten",
  "The citizenship ceremony": "Die Einbürgerungszeremonie",
  "Where": "Wo",
  "At a registered test centre, booked online. You must book at least 3 days ahead and bring the same ID you booked with.":
    "In einem registrierten Testzentrum, online gebucht. Du musst mindestens 3 Tage im Voraus buchen und denselben Ausweis mitbringen, mit dem du gebucht hast.",
  "Who": "Wer",
  "Usually required if you are aged 18 to 64. There are exemptions for some long-term medical conditions.":
    "In der Regel erforderlich, wenn du zwischen 18 und 64 Jahre alt bist. Bei bestimmten langfristigen Erkrankungen gibt es Ausnahmen.",
  "Result": "Ergebnis",
  "You find out on the day. If you fail you can retake it, but you must wait 7 days between attempts.":
    "Du erfährst es noch am selben Tag. Wenn du durchfällst, kannst du wiederholen, musst aber 7 Tage zwischen den Versuchen warten.",
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
};
